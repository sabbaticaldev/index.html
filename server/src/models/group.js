import { mkdir, readFile, writeFile } from "fs/promises";
import ogs from "open-graph-scraper";
import path from "path";

import LLM from "../services/llm/index.js";
import { processGroupInfo } from "../services/llm/tasks/whatsapp.js";
import { connectToWhatsApp } from "../services/whatsapp/index.js";
import { executeTasks } from "../utils.js";

const DATA_FOLDER = "./app/apps/allfortraveler/data/";

const getInviteCode = (url) => url.split("chat.whatsapp.com/")[1];

const fetchOGData = async (url) => (await ogs({ url })).result;

const processGroup = async (inviteUrl, sock) => {
  const inviteCode = getInviteCode(inviteUrl);
  let groupData = { status: "BAD_REQUEST" };

  try {
    groupData = await sock.groupGetInviteInfo(inviteCode);
    const groupId = groupData?.id || groupData;

    if (groupData?.size === 1 && groupId) {
      groupData = await sock.groupAcceptInvite(inviteCode);
      groupData = await sock.groupMetadata(groupId);
    }
  } catch (error) {
    if (error.message !== "bad-request") {
      try {
        groupData = await sock.groupGetInviteInfo(inviteCode);
        groupData =
          error.message === "conflict"
            ? await sock.groupMetadata(groupData.id)
            : { ...groupData, status: "NOT_AUTHORIZED" };
      } catch (innerError) {
        console.log({ innerError });
      }
    }
    console.error({ error });
  } finally {
    groupData.status =
      groupData.size === 1
        ? "REQUEST"
        : groupData.size > 1
          ? "JOINED"
          : groupData.status;
  }

  return groupData;
};

const processGroupInvite = async (url) => {
  const sock = await connectToWhatsApp({ keepAlive: true });
  const outputPath = path.join(DATA_FOLDER, "groupData.json");
  const llmPath = path.join(DATA_FOLDER, "llm.json");
  const deps = {};

  const tasks = [
    {
      description: "Fetch Group Data",
      operation: () => fetchOGData(url),
      key: "ogData",
    },
    {
      description: "Connect and Process Group",
      operation: () => processGroup(url, sock),
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
        writeFile(llmPath, JSON.stringify(groupInfo));
        return groupInfo;
      },
    },
    {
      description: "Create Group",
      operation: async () => {
        const { groupData } = deps;
        if (
          groupData?.id &&
          !["BAD_REQUEST", "NOT_AUTHORIZED"].includes(groupData.status)
        ) {
          return createGroup({ ...groupData, url });
        }
      },
      filePath: outputPath,
      dependencies: ["groupData"],
    },
  ];

  try {
    await executeTasks({ tasks, deps });
    console.log("Group processing completed:", deps);
    return deps.groupData;
  } catch (error) {
    console.error("Error processing group:", error);
    throw error;
  }
};

const createGroup = async (groupData) => {
  const { id } = groupData;
  const date = new Date().toISOString().slice(0, 10);

  const currentGroupFolder = path.join(DATA_FOLDER, date, "groups");
  const latestGroupFolder = path.join(DATA_FOLDER, "latest", "groups");
  const filename = `${id}.json`;
  const currentFilePath = path.join(currentGroupFolder, filename);
  const latestFilePath = path.join(latestGroupFolder, filename);

  try {
    await Promise.all([
      mkdir(currentGroupFolder, { recursive: true }),
      mkdir(latestGroupFolder, { recursive: true }),
    ]);

    const dataString = JSON.stringify({ ...groupData, date }, null, 2);

    await Promise.all([
      writeFile(currentFilePath, dataString),
      writeFile(latestFilePath, dataString),
    ]);
  } catch (error) {
    console.error("Error saving group data:", error);
    throw new Error("Failed to save group data");
  }
};

export const fetchGroup = async (url) => {
  try {
    const [ogResult, groupData] = await Promise.all([
      fetchOGData(url),
      processGroupInvite(url),
    ]);

    return groupData
      ? {
          ...groupData,
          name: ogResult.ogTitle,
          image: ogResult?.ogImage?.[0]?.url,
          url,
        }
      : {};
  } catch (error) {
    console.error("Error fetching group data:", error);
    throw new Error("Error processing request");
  }
};

export const importGroups = async ({ delay, max, datetime = null }) => {
  const groupsPath = datetime
    ? path.join(DATA_FOLDER, datetime, "groups")
    : path.join(DATA_FOLDER, "groups.json");

  const groups = datetime
    ? await Promise.all(
        (await fs.readdir(groupsPath))
          .slice(0, max)
          .map((file) =>
            readFile(path.join(groupsPath, file), "utf8").then(JSON.parse),
        ),
      )
    : JSON.parse(await readFile(groupsPath, "utf8")).slice(0, max);

  const importedGroups = [];

  for (const group of groups) {
    const response = await fetchGroup(group.url);

    if (response?.status !== "BAD_REQUEST") {
      console.log(`Creating group for URL: ${group.url}`);
      if (response?.groupInfo.id) {
        await createGroup({ ...group, ...response.groupInfo });
        console.log(`Group created for URL: ${group.url}`);
        importedGroups.push({ ...group, ...response.groupInfo });
      } else {
        console.error({ response });
      }
    }
  }

  return importedGroups;
};
