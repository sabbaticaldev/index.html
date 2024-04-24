import { Browsers, DisconnectReason, makeInMemoryStore, makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import fs from "fs";
import { mkdir,readFile, writeFile } from "fs/promises";
import ogs from "open-graph-scraper";
import path from "path";

import { executeTasks,sleep } from "../utils.js";

const store = makeInMemoryStore({});
store.readFromFile(".baileys/store.json");
setInterval(() => {
  store.writeToFile(".baileys/store.json");
}, 10000);
let sock;

const DATA_FOLDER = "./app/apps/allfortraveler/data/";
const CITIES_JSON = DATA_FOLDER + "tags/cities.json";
const COUNTRIES_JSON = DATA_FOLDER + "tags/countries.json";
const TAGS_JSON = DATA_FOLDER + "tags/tags.json";
const GROUPS_JSON = DATA_FOLDER + "groups.json";

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


export async function sendWhatsAppMessage({sock, messages = [], phoneNumber}) {
  async function sendMessage() {
    try {
      if (sock.status !== "OPEN") {
        throw new Error("Socket is not open");
      }
      else {
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
      }
      else {
        console.log("CLOSE CONNECTION");
        sock.end();
      }
    }
  }
  await sendMessage();
}

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

export async function importTags() {
  try {
    const cities = JSON.parse(await readFile(CITIES_JSON, "utf8"));
    const countries = JSON.parse(await readFile(COUNTRIES_JSON, "utf8"));
    const tags = JSON.parse(await readFile(TAGS_JSON, "utf8"));
    const allTags = [];
  
    // Process cities
    cities.forEach(city => {
      allTags.push({ id: city, city: true });
    });
  
    // Process countries
    countries.forEach(country => {
      allTags.push({ id: country, country: true });
    });
  
    // Process other tags
    tags.forEach(tag => {
      allTags.push({ id: tag });
    });
  
    return allTags; // Return the array with all tags
  } catch (error) {
    console.error("Error importing tags:", error);
    throw error; // Rethrow error for handling in Express
  }
}


export async function fetchGroupData(url) {
  const { data } = await ogs({ url });
  return {
    inviteUrl: url,
    metadata: data,
  };
}
const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];

export async function processGroup(inviteUrl) {  
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


const deps = {};

const processGroupInvite = async (url) => {
  try {
    sock = await connectToWhatsApp({ keepAlive: true });
    const outputPath = path.join(DATA_FOLDER, "groupData.json");

    const tasks = [
      {
        description: "Fetch Group Data",
        operation: async () => await fetchGroupData(url),
        key: "ogData",
      },
      {
        description: "Connect and Process Group",
        operation: async () => await processGroup(url),
        filePath: outputPath,
        dependencies: ["ogData"],  
        key: "groupData",
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


export async function fetchGroup(url) {
  const fetchOGData = async (url) => {
    const { result } = await ogs({ url });
    return result;
  };    
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

