import fs from "fs";
import { IgApiClient } from "instagram-private-api";
import fetch from "node-fetch";

import settings from "../settings.js";

export async function fetchInstagramData(url) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
      "X-RapidAPI-Host": settings.RAPIDAPI_API,
    },
  };
  const endpoint =
    "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php";
  const response = await fetch(
    `${endpoint}?url=${encodeURIComponent(url)}`,
    options,
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      `Failed to fetch data from Instagram: ${response.statusText}`,
    );

  return {
    video: data.video,
    image: data.image,
    description: data.caption,
  };
}

const { IG_USERNAME, IG_PASSWORD } = settings;

const createApiQueue = (delay) => {
  let queue = [];
  let busy = false;

  const processQueue = async () => {
    if (queue.length > 0 && !busy) {
      busy = true;
      const { task, resolve } = queue.shift();
      try {
        const result = await task(); // Capture the result of the task
        resolve(result); // Resolve the promise with the result
      } catch (error) {
        console.error("Task failed:", error);
        resolve(undefined); // Resolve with undefined on error
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      busy = false;
      processQueue();
    }
  };

  const enqueue = (task) => {
    return new Promise((resolve) => {
      queue.push({ task, resolve });
      processQueue();
    });
  };

  return { enqueue };
};

export async function GetTrends(type) {
  const ig = new IgApiClient();

  const statePath = ".instagram-private-api";
  let userId;

  if (fs.existsSync(statePath)) {
    const state = fs.readFileSync(statePath).toString();
    await ig.state.deserialize(state);
    userId = ig.state.extractUserId();
  } else {
    ig.state.generateDevice(IG_USERNAME);
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    process.nextTick(async () => await ig.simulate.postLoginFlow());
    userId = loggedInUser.pk.toString();

    const state = await ig.state.serialize();
    fs.writeFileSync(statePath, JSON.stringify(state));
  }

  const userInfo = await ig.user.info(userId);
  const follower_count = userInfo.follower_count;

  console.log(`User id: ${userId}`);
  console.log(`Follower count: ${follower_count}`);
  const apiQueue = createApiQueue(200); // 200 ms delay

  const fetchMedia = async (userId) => {
    const userMedia = await ig.feed.user(userId).items();
    return userMedia;
  };

  apiQueue
    .enqueue(() => {
      //fetchMedia(userId);
      ig.search.tags("travel").then((search) => {
        search.forEach((entry) => {
          console.log({ entry });
        });
      });
    })
    .then((media) => console.log({ media }))
    .catch((error) => console.error("Failed to fetch media:", error));
  console.log({ userId });
}
