import { DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import fs from "fs";

const store = makeInMemoryStore({});
store.readFromFile("./baileys_store.json");
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10000);

export async function connectToWhatsApp(config = {}) {
  console.log({config});
  const { keepAlive = false } = config;
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });
  store.bind(sock.ev);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      // Check if the disconnect reason is unauthorized
      if (lastDisconnect.error?.output?.statusCode === DisconnectReason.unauthorized || lastDisconnect.error?.output?.statusCode === 401) {
        console.log("Unauthorized access, likely need to re-authenticate. Regenerating QR...");
        // Re-initialize authentication state to force QR regeneration
        fs.unlink("./auth_info_baileys/creds.json", (error) => {
          if (error) {
            console.error("Failed to delete file:", error);
            return;
          }
          console.log("File deleted successfully");
          connectToWhatsApp({ keepAlive });
        });
        
      } else {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log("Connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
        if (shouldReconnect && keepAlive) {
          connectToWhatsApp({ keepAlive });
        }
      }
    } else if (connection === "open") {
      console.log("Connection opened!");
      if (!keepAlive) {
        await sock.logout();
      }
    }
  });

  sock.ev.on("messages.upsert", async m => {
    console.log("New message upsert:", JSON.stringify(m, null, 2));
    if (!keepAlive) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for any pending operations
      await sock.logout();
    }
  });

  return sock;
}
