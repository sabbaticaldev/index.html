
import fs from "fs";
import { readFile } from "fs/promises";
import { mkdir, writeFile } from "fs/promises";
import ogs from "open-graph-scraper";
import path from "path";

import LLM from "../services/llm/index.js";
import { processGroupInfo } from "../services/llm/tasks/whatsapp.js";
import { connectToWhatsApp } from "../services/whatsapp/index.js";
import { executeTasks, sleep } from "../utils.js";
const DATA_FOLDER = "./app/apps/allfortraveler/data/";

const GROUPS_JSON = DATA_FOLDER + "groups.json";

const deps = {};
let sock;

const fetchOGData = async (url) => {
  const { result } = await ogs({ url });
  return result;
};    

const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];

export async function processGroup(inviteUrl, sock) {  
  let groupData = { status: "BAD_REQUEST" };
  let groupId;
  const inviteCode = getInviteCode(inviteUrl);
  
  try {    
    groupData = await sock.groupGetInviteInfo(inviteCode);
    groupId = groupData?.id || groupData;    
    console.log("Console 1", {groupData});
    if(groupData?.size === 1 && groupId) {
      groupData = await sock.groupAcceptInvite(getInviteCode(inviteUrl));
      console.log("Console 2", {groupData});
      groupData = await sock.groupMetadata(groupId);
      console.log("Console 3", {groupData});
    }    
  }
  catch(error) {    
    if (error.message !== "bad-request") {
      try {
        groupData = await sock.groupGetInviteInfo(inviteCode);
        if (error.message === "conflict") {
          groupData = await sock.groupMetadata(groupData.id);
        } else if (error.message === "not-authorized") {
          groupData.status = "NOT_AUTHORIZED";
        }
      } catch (innerError) {
        console.log({ innerError });
      }
    }
    console.error({ error });
  }
  finally {
    if (groupData.size === 1) {
      groupData.status = "REQUEST";
    } else if (groupData.size > 1) {
      groupData.status = "JOINED";
    }
  }
  return groupData;
}

const processGroupInvite = async (url) => {
  try {
    sock = await connectToWhatsApp({ keepAlive: true });
    const outputPath = path.join(DATA_FOLDER, "groupData.json");
    const llmPath = path.join(DATA_FOLDER, "llm.json");    

    const tasks = [
      {
        description: "Fetch Group Data",
        operation: async () => await fetchGroupData(url),
        key: "ogData",
      },
      {
        description: "Connect and Process Group",
        operation: async () => await processGroup(url, sock),
        filePath: outputPath,
        dependencies: ["ogData"],  
        key: "groupData",
      },
      {
        description: "LLM post generation",
        filePath: llmPath,
        key: "llm",
        dependencies: ["instagram"],
        operation: async () => {
          const llm = LLM("bedrock");
          const groupInfo = await processGroupInfo(llm, deps);
          console.log({groupInfo});
          fs.writeFileSync(llmPath, JSON.stringify(groupInfo));
          return groupInfo;
        }
      },
      {
        description: "Create Group",
        operation: async () =>  {
          const { groupData } = deps;
          if (groupData?.id && !["BAD_REQUEST", "NOT_AUTHORIZED"].includes(groupData.status)) {
            groupData.url = url;
            const group = await createGroup({ groupData });
            return group;
          }          
        },
        filePath: outputPath,
        dependencies: ["groupData"],
      },
    ];

    try {
      const results = await executeTasks({ tasks, deps });
      console.log("Group processing completed:", results);
      return deps.groupData;      
    } catch (error) {
      console.error("Error processing group:", error);
    }
  } catch (error) {
    console.error("Failed to connect to WhatsApp:", error);
    throw error;  
  }
};

export async function createGroup(groupData) {
  const id = groupData.id;
  const date = new Date().toISOString().slice(0, 10);  
  groupData.date = date;
  const currentGroupFolder = path.join(DATA_FOLDER, date, "groups"); 
  const latestGroupFolder = path.join(DATA_FOLDER, "latest", "groups"); 
  const filename = `${id}.json`; 
  const currentFilePath = path.join(currentGroupFolder, filename); 
  const latestFilePath = path.join(latestGroupFolder, filename); 
      
  try {
    await Promise.all([
      mkdir(currentGroupFolder, { recursive: true }),
      mkdir(latestGroupFolder, { recursive: true })
    ]);
    
    const dataString = JSON.stringify(groupData, null, 2);
    
    await Promise.all([
      writeFile(currentFilePath, dataString),
      writeFile(latestFilePath, dataString)
    ]);
  } catch (error) {
    console.error("Error saving group data:", error);
    throw new Error("Failed to save group data");
  }
}
export async function fetchGroupData(url) {
  const { data } = await ogs({ url });
  return {
    inviteUrl: url,
    metadata: data,
  };
} 

export async function fetchGroup(url) {
  try {
    const ogResult = await fetchOGData(url);
    const groupData = await processGroupInvite(url);
    return groupData ? {
      ...groupData,
      name: ogResult.ogTitle,
      image: ogResult?.ogImage?.[0]?.url,
      url,
         
    } : {};
  } catch (error) {
    console.error("Error fetching group data:", error);
    throw new Error("Error processing request");
  }
}
  
export async function importGroups({delay, max, datetime = null}) {
  let groups;
  if (datetime) {
    const dateFolder = path.join(DATA_FOLDER, datetime, "groups");
    try {
      const groupFiles = await fs.readdir(dateFolder);
      groups = await Promise.all(groupFiles.slice(0, max).map(file =>
        readFile(path.join(dateFolder, file), "utf8").then(data => JSON.parse(data))
      ));
    } catch (error) {
      console.error("Error reading group files:", error);
      throw error;
    }
    return groups;
  } else {
    try {
      const data = await readFile(GROUPS_JSON, "utf8");
      groups = JSON.parse(data);
      groups = groups.slice(0, max); 
    } catch (error) {
      console.error("Error reading groups JSON:", error);
      throw error;
    }
  }
  const importedGroups = [];
    
  for (const group of groups) {
    const response = await fetchGroup(group.url);
    await sleep(delay);
  
    if (response?.status !== "BAD_REQUEST") {
      console.log(`Creating group for URL: ${group.url}`); // Log before creation
      if(response?.groupInfo.id) {
        await createGroup({...group, ...response.groupInfo});
        console.log(`Group created for URL: ${group.url}`); // Log after creation
        importedGroups.push({...group, ...response.groupInfo});
      }
      else {
        console.error({response});
      }
    }
  }
    
  return importedGroups;  // Return the array of all imported groups
}