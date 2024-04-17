import fs from "fs/promises"; 
import ogs from "open-graph-scraper";
import path from "path";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import { connectToWhatsApp } from "./baileys.js";
const DATA_FOLDER = "./app/apps/allfortraveler/data/";
async function createGroup(groupData) {
  const date = new Date().toISOString().slice(0, 10);  // Get current date in YYYY-MM-DD format
  const groupFolder = path.join(DATA_FOLDER, date, "groups"); // Create the path for the group data
  const safeUrl = groupData.url.split("chat.whatsapp.com/")[1]; // Extract invite code as filename
  const filePath = path.join(groupFolder, `${safeUrl}.json`); // Construct file path
  
  try {
    await fs.mkdir(groupFolder, { recursive: true }); // Ensure the directory exists, create if not
    await fs.writeFile(filePath, JSON.stringify(groupData, null, 2)); // Write group data to file with pretty print
    console.log(`Group data saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving group data:", error);
    throw new Error("Failed to save group data");
  }
}
const sock = await connectToWhatsApp();
const CITIES_JSON = DATA_FOLDER + "tags/cities.json";
const COUNTRIES_JSON = DATA_FOLDER + "tags/countries.json";
const TAGS_JSON = DATA_FOLDER + "tags/tags.json";
const GROUPS_JSON = DATA_FOLDER + "groups.json";

async function importGroups({delay, max, datetime = null}) {
  let groups;
  console.log({delay, max, datetime});
  if (datetime) {
    // If dateTime is provided, read group files from the specific date folder
    const dateFolder = path.join(DATA_FOLDER, datetime, "groups");
    try {
      const groupFiles = await fs.readdir(dateFolder);
      // Read and parse only up to maxGroups files
      groups = await Promise.all(groupFiles.slice(0, max).map(file => 
        fs.readFile(path.join(dateFolder, file), "utf8").then(data => JSON.parse(data))
      ));
    } catch (error) {
      console.error("Error reading group files:", error);
      throw error;
    }
    return groups;
  } else {
    // If no dateTime, read the groups directly from GROUPS_JSON
    try {
      const data = await fs.readFile(GROUPS_JSON, "utf8");
      groups = JSON.parse(data);
      groups = groups.slice(0, max); // Apply maxGroups limit
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
      await createGroup({...group, groupInfo: response.groupInfo});
      importedGroups.push({...group, groupInfo: response.groupInfo});
    }
  }
  
  return importedGroups;  // Return the array of all imported groups
}
  
  
  

async function importTags() {
  try {
    const cities = JSON.parse(await fs.readFile(CITIES_JSON, "utf8"));
    const countries = JSON.parse(await fs.readFile(COUNTRIES_JSON, "utf8"));
    const tags = JSON.parse(await fs.readFile(TAGS_JSON, "utf8"));
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
  
async function fetchGroup(url) {
  const fetchOGData = async (url) => {
    const { result } = await ogs({ url });
    return result;
  };
  
  const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];
  
  const processGroupInvite = async (inviteCode) => {
    let groupData = { status: "BAD_REQUEST" };
    try {
      const groupId = await sock.groupAcceptInvite(inviteCode);
      groupData = await sock.groupMetadata(groupId);
    } catch (error) {
      if(error.message !== "bad-request") {
        groupData = await sock.groupGetInviteInfo(inviteCode);
        if(error.message === "conflict") {
          groupData = await sock.groupMetadata(groupData.id);
        } else if (error.message === "not-authorized") {
          groupData.status = "NOT_AUTHORIZED";
        } else {
          console.log({ error });
        }
      }
    }
    finally {
      if(groupData.size === 1)
        groupData.status = "REQUEST";
      else if(groupData.size > 1)
        groupData.status = "JOINED";
    }

    if(!["BAD_REQUEST", "NOT_AUTHORIZED"].includes(groupData.status)) {
      groupData.url = url;
      await createGroup(groupData);
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


export {fetchGroup,importGroups,importTags};