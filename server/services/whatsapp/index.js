import {
  Browsers,
  DisconnectReason,
  makeInMemoryStore,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import { sleep } from "../../utils.js";

const store = makeInMemoryStore({});
store.readFromFile(".baileys/store.json");
setInterval(() => {
  store.writeToFile(".baileys/store.json");
}, 10000);
export let sock;
const admins = ["553197882008@s.whatsapp.net"]; // Admin WhatsApp IDs

export function isAdmin(user) {
  return admins.includes(user);
}

export async function handleRemoveMessage({ remoteJid, messageId }, sock) {
  try {
    await sock.sendMessage(remoteJid, { delete: messageId });

    console.log("Message removed.");
  } catch (error) {
    console.error("Failed to remove message:", error);
  }
}

export async function handleRemoveMessageAndUser(
  { remoteJid, user, messageId },
  sock,
) {
  try {
    // Remove the message
    await sock.sendMessage(remoteJid, { delete: messageId });
    console.log("Message removed.");

    await sock.groupParticipantsUpdate(remoteJid, [user], "remove");

    console.log("User removed from the group.");
  } catch (error) {
    console.error("Failed to remove message or user:", error);
  }
}

export async function connectToWhatsApp(config = {}) {
  const { keepAlive = false, credential = "default" } = config;
  const { state, saveCreds } = await useMultiFileAuthState(
    `.baileys/${credential}`,
  );

  if (sock && sock.status === "OPEN") return sock;

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

  sock.ev.on("messages.upsert", async (event) => {
    console.log(JSON.stringify(event, null, 2));
    if (!event?.messages?.[0]?.message?.reactionMessage) return;

    const participant = event.messages[0].key.participant;
    const remoteJid = event.messages[0].message.reactionMessage.key.remoteJid;
    const messageId = event.messages[0].message.reactionMessage.key;
    const user = event.messages[0].message.reactionMessage.key.participant;
    const emoji = event.messages[0].message.reactionMessage.text;

    if (!isAdmin(participant)) {
      console.log("Unauthorized action attempted by non-admin.");
      return;
    }

    if (["👎", "😮"].includes(emoji)) {
      console.log({ remoteJid, messageId });
      await handleRemoveMessage({ remoteJid, messageId }, sock);
    } else if (emoji === "🚫") {
      await handleRemoveMessageAndUser({ remoteJid, user, messageId }, sock);
    }
  });
  return new Promise((resolve, reject) => {
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        sock.status = "CLOSE";
        if (
          lastDisconnect.error?.output?.statusCode ===
            DisconnectReason.unauthorized ||
          lastDisconnect.error?.output?.statusCode === 401
        ) {
          connectToWhatsApp({ keepAlive });
        } else {
          const shouldReconnect =
            lastDisconnect.error?.output?.statusCode !==
            DisconnectReason.loggedOut;
          console.log(
            "Connection closed due to ",
            lastDisconnect.error,
            ", reconnecting ",
            shouldReconnect,
          );
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

export async function sendWhatsAppMessage({
  sock,
  messages = [],
  phoneNumber,
}) {
  async function sendMessage() {
    try {
      if (sock.status !== "OPEN") {
        throw new Error("Socket is not open");
      } else {
        console.log("CONNECTION OPEN");
      }

      messages.forEach(async (message) => {
        await sock.sendMessage(phoneNumber, message);
      });
      console.log("Messages sent.");
    } catch (error) {
      if (error.message === "Socket is not open") {
        console.log("Socket is not open, waiting to retry...");
        await sleep(1000);
        await sendMessage();
      } else {
        console.log("CLOSE CONNECTION");
        sock.end();
      }
    }
  }
  await sendMessage();
}
