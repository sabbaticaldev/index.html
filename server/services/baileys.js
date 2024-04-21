import { Browsers, DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

import { sleep } from "../utils.js";
const store = makeInMemoryStore({});
store.readFromFile(".baileys/store.json");
setInterval(() => {
  store.writeToFile(".baileys/store.json");
}, 10000);
let sock;
export async function connectToWhatsApp(config = {}) {
  const { keepAlive = false } = config;
  const { state, saveCreds } = await useMultiFileAuthState(".baileys");
  
  if(sock && sock.status === "OPEN")
    return sock;

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    defaultQueryTimeoutMs: undefined,
  });
  store.bind(sock.ev);
  sock.status = "CLOSED";
  sock.ev.on("creds.update", saveCreds);
  return new Promise((resolve, reject) => {
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        sock.status = "CLOSE";
        if (lastDisconnect.error?.output?.statusCode === DisconnectReason.unauthorized || lastDisconnect.error?.output?.statusCode === 401) {
          connectToWhatsApp({ keepAlive });        
        } else {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log("Connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
          if (shouldReconnect) {
            connectToWhatsApp({ keepAlive });
          }
        }
      } 
      if (connection === "open") {
        sock.status = "OPEN";
        console.log("Connection opened!");
        if (!keepAlive) {
          await sleep(3000);
          await sock.end("keepAlive false");
        }
        resolve(sock); 
      }

      sock.ev.on("close", () => {
        reject(new Error("Connection closed before it could be established."));
      });
    });
  });
}
