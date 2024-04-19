import { DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

const store = makeInMemoryStore({});
store.readFromFile("./baileys_store.json");
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10000);

export async function connectToWhatsApp(config = {}) {
  const { keepAlive = false } = config;
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
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
      if (shouldReconnect && keepAlive) {
        console.log("reconnecting");
        connectToWhatsApp(keepAlive);
      }
    } else if (connection === "open") {
      console.log("opened connection!");
      // Optionally close the connection if keepAlive is false
      if (!keepAlive) {
        console.log("Connection will close as keepAlive is false");
        await sock.logout();
      }
    }
  });

  sock.ev.on("messages.upsert", async m => {
    console.log(JSON.stringify(m, undefined, 2));
    // Handle message logic here, and if keepAlive is false, consider closing the socket
    if (!keepAlive) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for any pending operations
      await sock.logout();
    }
  });

  return sock;
}
