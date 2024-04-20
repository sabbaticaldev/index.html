import { Browsers, DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

import { sleep } from "../utils.js";
const store = makeInMemoryStore({});
store.readFromFile("./baileys_store.json");
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10000);

export async function connectToWhatsApp(config = {}) {
  console.log({Browsers});
  const { keepAlive = false } = config;
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    defaultQueryTimeoutMs: undefined,
  });
  store.bind(sock.ev);
  sock.status = "CLOSED";
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    console.log("inside baileys", {status: sock.status});
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      sock.status = "CLOSE";
      // Check if the disconnect reason is unauthorized
      if (lastDisconnect.error?.output?.statusCode === DisconnectReason.unauthorized || lastDisconnect.error?.output?.statusCode === 401) {        
        connectToWhatsApp({ keepAlive });        
      } else {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log("Connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
        if (shouldReconnect) {
          connectToWhatsApp({ keepAlive });
        }
      }
    } else if (connection === "open") {
      sock.status = "OPEN";
      console.log("Connection opened!");
      if (!keepAlive) {
        await sleep(3000);
        await sock.end("keepAlive false");
      }
    }
  });
  sock.ev.on("messages.upsert", async m => {
    console.log("New message upsert:", JSON.stringify(m, null, 2));
    if (!keepAlive) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await sock.end("keepAlive false");
    }
  });

  return sock;
}
