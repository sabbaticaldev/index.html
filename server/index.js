import express from "express";
import fs from "fs/promises"; 
import ogs from "open-graph-scraper";

import { connectToWhatsApp } from "./baileys.js";
import { associateGroupTag,createGroup, createOrUpdateParticipant, createOrUpdateTag } from "./queries.js";



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

  async function fetchGroup(url) {
    const fetchOGData = async (url) => {
      const { result } = await ogs({ url });
      return result;
    };
  
    const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];
  
    const processGroupInvite = async (inviteCode) => {
      let groupData = {status: "BAD_REQUEST"};
      try {
        const groupId = await sock.groupAcceptInvite(inviteCode);
        groupData = await sock.groupMetadata(groupId);
      } catch (error) {
        if(error.message !== "bad-request") {
          groupData = await sock.groupGetInviteInfo(inviteCode);
          if(error.message === "conflict") {
            groupData = await sock.groupMetadata(groupData.id);
          }
          if (error.message === "already-exists" || error.message === "conflict") {
            groupData.status = "JOINED";
          } else if (error.message === "not-authorized") {
            groupData.status = "NOT_AUTHORIZED";
          } else {
            console.error({error});
          }
        }
      }
      const participants = groupData?.participants?.map(participant => ({
        number: participant.id.split("@")[0],
        admin: participant.admin === "admin"
      }));
      if(groupData.status !== "BAD_REQUEST") {
        groupData.url = url;
        const groupId = await createGroup(groupData);
    
        for (const participant of participants) {
          await createOrUpdateParticipant(participant, groupId);
        }      
      }
      return groupData;
    };
  
    try {
      const ogResult = await fetchOGData(url);
      const inviteCode = getInviteCode(url);
      const groupData = await processGroupInvite(inviteCode);
      return {
        status: groupData.status,
        name: ogResult.ogTitle,
        image: ogResult?.ogImage?.[0]?.url,
        url,
        groupInfo: groupData
      };
    } catch (error) {
      console.error("Error fetching group data:", error);
      throw new Error("Error processing request");
    }
  }
  
  app.post("/import-groups", async (req, res) => {
    try {
      const groups = JSON.parse(await fs.readFile("./groups.json", "utf8"));
      for (const group of groups) {
        const response = await fetchGroup(group.url); 
        const groupId = await createGroup(response.groupInfo);
        for (const tag of group.tags) {
          const tagId = await createOrUpdateTag(tag);
          await associateGroupTag(groupId, tagId);
        }
      }
      res.status(200).send({ message: "Groups imported successfully" });
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
