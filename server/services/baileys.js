import { DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

const store = makeInMemoryStore({ });
store.readFromFile("./baileys_store.json");
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10_000);
export async function connectToWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({ 
    auth: state,
    printQRInTerminal: true
  });
  store.bind(sock.ev);
  
  sock.ev.on("chats.set", () => {
    console.log("got chats", store.chats.all());
  });
    
  sock.ev.on("contacts.set", () => {
    console.log("got contacts", Object.values(store.contacts));
  });
  sock.ev.on ("creds.update", saveCreds);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
      if(shouldReconnect) {
        console.log("reconnecting   ");
        connectToWhatsApp();
      }
    } else if(connection === "open") {
      console.log("opened connection!");            
    }
  });
  sock.ev.on("messages.upsert", async m => {
    console.log(JSON.stringify(m, undefined, 2));
  });
  return sock;
}