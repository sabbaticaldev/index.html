import express from "express";

import { fetchGroup, importGroups } from "./models/group.js";
import { importTags } from "./models/tag.js";
import { connectToWhatsApp, handleRemoveMessage, handleRemoveMessageAndUser, isAdmin } from "./services/whatsapp/index.js";

async function main() {
  const app = express();
  const port = 3000;
  const importDelay = 1000;
  const maxGroups = 5; 
  const sock = await connectToWhatsApp({ keepAlive: true, credential: "admin" });

  sock.ev.on("messages.upsert", async event => {
    console.log(JSON.stringify(event, null, 2));
    if(!event?.messages?.[0]?.message?.reactionMessage) return;
  
    const participant = event.messages[0].key.participant;
    const remoteJid = event.messages[0].message.reactionMessage.key.remoteJid;
    const messageId = event.messages[0].message.reactionMessage.key;
    const user = event.messages[0].message.reactionMessage.key.participant;
    const emoji = event.messages[0].message.reactionMessage.text;
  
    if (!isAdmin(participant)) {
      console.log("Unauthorized action attempted by non-admin.");
      return;
    }
  
    if (emoji === "👎") {
      console.log({ remoteJid, messageId });
      await handleRemoveMessage({ remoteJid, messageId }, sock);
    } else if (emoji === "🚫") {
      await handleRemoveMessageAndUser({ remoteJid, user, messageId }, sock);
    }
  });
  
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


  app.get("/import-tags", async (req, res) => {
    try {
      const tags = await importTags();
      res.status(200).send(tags);
    } catch (error) {
      res.status(500).send({ error: "Error importing tags" });
    }
  });
  app.get("/import-groups", async (req, res) => {
    try {
      const datetime = req.query.datetime ? decodeURIComponent(req.query.datetime) : undefined;
      const delay = req.query.delay || importDelay;
      const max = req.query.max || maxGroups;
      const groups = await importGroups({delay, max, datetime});
      res.status(200).send(groups);
    } catch (error) {
      console.error("Error importing groups:", error);
      res.status(500).send({ error: "Error importing groups" });
    }
  });

  app.get("/fetch-group", async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }
  
    try {
      const response = await fetchGroup(url); 
      res.send(response);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ error: "Error processing request" });
    }
  });
  

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch(err => console.error(err));
