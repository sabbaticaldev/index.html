use warp::Filter;
use futures_util::sink::SinkExt;
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use warp::ws::{WebSocket, Message};

type Clients = Arc<Mutex<HashMap<String, tokio::sync::mpsc::UnboundedSender<Message>>>>;

#[tokio::main]
async fn main() {
    let clients: Clients = Arc::new(Mutex::new(HashMap::new()));

    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(with_clients(clients.clone()))
        .map(|ws: warp::ws::Ws, clients: Clients| {
            ws.on_upgrade(move |socket| Box::pin(handle_connection(socket, clients)))
        });
    
        println!("Server started on http://127.0.0.1:3030");
    warp::serve(ws_route)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

fn with_clients(clients: Clients) -> impl Filter<Extract = (Clients,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || clients.clone())
}
async fn handle_connection(mut ws: WebSocket, clients: Clients) {
    println!("New WebSocket connection established!");

    let (mut ws_send, mut ws_recv) = ws.split();

    let (client_tx, mut client_rx) = tokio::sync::mpsc::unbounded_channel();

    tokio::task::spawn(async move {
        while let Some(msg) = client_rx.recv().await {
            let _ = ws_send.send(msg).await;
        }
    });

    let mut registered_username = None;  // This will store the registered username

    while let Some(result) = ws_recv.next().await {
        match &result {
            Ok(msg) => {
                println!("Received a message: {:?}", msg);
            },
            Err(e) => {
                println!("Error receiving WS message: {:?}", e);
            }
        }
        
        match result {
            Ok(msg) if msg.is_text() => {
                let data = msg.to_str().unwrap_or("");
                if let Ok(parsed_msg) = serde_json::from_str::<serde_json::Value>(&data) {
                    match parsed_msg["type"].as_str() {
                        Some("register") => {
                            let user = parsed_msg["username"].as_str().unwrap_or("").to_string();
                            clients.lock().unwrap().insert(user.clone(), client_tx.clone());
                            registered_username = Some(user);
                        }
                        Some("offer") | Some("answer") | Some("ice-candidate") => {
                            println!("Got some webrtc message: {}", parsed_msg);
                            if let Some(target) = parsed_msg["targetUsername"].as_str() {
                                println!("Trying to forward message to: {}", target);
                                let client_map = clients.lock().unwrap();                        
                                if client_map.contains_key(target) {
                                    println!("Target {} is registered.", target);                                    
                                    if let Some(target_tx) = client_map.get(target) {
                                        target_tx.send(msg.clone()).expect("Failed to forward message");
                                        println!("Message forwarded to: {}", target);
                                    } else {
                                        println!("Could not obtain sender for target: {}", target);
                                    }
                                } else {
                                    println!("Target {} is NOT registered.", target);
                                }
                            } else {
                                println!("Received a message without targetUsername field.");
                            }
                        }                        
                        _ => {}
                    }
                }
            }
            Ok(msg) if msg.is_close() => {
                println!("Connection closed with close message: {:?}", msg.to_str());
                if let Some(user) = registered_username {
                    clients.lock().unwrap().remove(&user);
                }
                break;
            }
            Ok(msg) if msg.is_ping() => {
                println!("Received ping");
            }
            Ok(msg) if msg.is_pong() => {
                println!("Received pong");
            }
            Ok(msg) if msg.is_binary() => {
                println!("Received binary data");
            }
            Err(e) => {
                println!("Error receiving WS message: {:?}", e);
            }
            _ => {
                println!("Received other type of message.");
            }
        }
    }
}
