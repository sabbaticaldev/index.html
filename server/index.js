import express from "express";
import ogs from "open-graph-scraper";

import { connectToWhatsApp } from "./baileys.js";
import { createGroup, createOrUpdateParticipant } from "./queries.js";


async function main() {
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

  app.get("/fetch-group", async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }

    const fetchOGData = async (url) => {
      const { result } = await ogs({ url });
      return result;
    };

    const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];

    const processGroupInvite = async (inviteCode) => {
      let groupData;
      try {
        const groupId = await sock.groupAcceptInvite(inviteCode);
        groupData = await sock.groupMetadata(groupId);
      } catch (error) {
        groupData = await sock.groupGetInviteInfo(inviteCode);
        if(error.message === "conflict") {
          groupData = await sock.groupMetadata(groupData.id);
        }
        if (error.message === "already-exists" || error.message === "conflict") {
          groupData.status = "JOINED";
        } else if (error.message === "not-authorized") {
          groupData.status = "NOT_AUTHORIZED";
        } else {
          throw error;
        }
      }
      const participants = groupData?.participants?.map(participant => ({
        number: participant.id.split("@")[0],
        admin: participant.admin === "admin"
      }));
      groupData.url = url;
      const groupId = await createGroup(groupData);
  
      for (const participant of participants) {
        await createOrUpdateParticipant(participant, groupId);
      }      
      return groupData;
    };
    

    try {
      const ogResult = await fetchOGData(url);
      const inviteCode = getInviteCode(url);
      const groupData = await processGroupInvite(inviteCode);
      const response = {
        status: groupData.status,
        name: ogResult.ogTitle,
        image: ogResult?.ogImage?.[0]?.url,
        url,
        groupInfo: groupData
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
}

main().catch(err => console.error(err));
