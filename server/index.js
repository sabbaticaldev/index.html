import { DisconnectReason, makeInMemoryStore,makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import express from "express";
import ogs from "open-graph-scraper";
// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ });
// can be read from a file
store.readFromFile("./baileys_store.json");
// saves the state to a file every 10s
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10_000);

// will listen from this socket
// the store can listen from a new socket once the current socket outlives its lifetime


async function connectToWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({ 
    auth: state,
    printQRInTerminal: true
  });
  store.bind(sock.ev);

  sock.ev.on("chats.set", () => {
    // can use "store.chats" however you want, even after the socket dies out
    // "chats" => a KeyedDB instance
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
      // reconnect if not logged out
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
  console.log(sock.groupGetInviteInfo);
  return sock;
}
// run in main file
const sock = await connectToWhatsApp();
const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/fetch-og", async (req, res) => {
  const url = decodeURIComponent(req.query.url);
  if (!url) {
    return res.status(400).send({ error: "URL is required" });
  }

  let group = {
    status: "NOT_FOUND", // Default status
    metadata: null
  };

  const fetchOGData = async (url) => {
    const { result } = await ogs({ url });
    return result;
  };

  const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];

  const processGroupInvite = async (inviteCode) => {
    try {
      const groupId = await sock.groupAcceptInvite(inviteCode);
      group.status = "JOINED";
      group.metadata = await sock.groupMetadata(groupId);
    } catch (error) {
      switch (error.message) {
      case "already-exists":
        group.status = "PENDING";
        group.metadata = await sock.groupGetInviteInfo(inviteCode);
        break;
      case "not-authorized":
        group.status = "NOT_AUTHORIZED";
        break;
      case "conflict":
        group.status = "JOINED";
        const inviteInfo = await sock.groupGetInviteInfo(inviteCode);
        console.log({inviteInfo});
        group.metadata = await sock.groupMetadata(inviteInfo.id);
        console.log(group.metadata);
        break;
      default:
        throw error;
      }
    }
  };

  try {
    const result = await fetchOGData(url);
    const inviteCode = getInviteCode(url);
    await processGroupInvite(inviteCode);

    const response = {
      status: group.status,
      name: result.ogTitle,
      image: result?.ogImage?.url,
      groupInfo: group.metadata
    };

    res.send(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send({ error: "Error processing request" });
  }
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
