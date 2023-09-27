const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const fromBase62 = (str) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = BASE62.indexOf(char);
    num = num * 62 + index;
  }
  return num;
};

export const toBase62 = (num) => {
  if (num === 0) return BASE62[0];
  let arr = [];
  while (num) {
    arr.unshift(BASE62[num % 62]);
    num = Math.floor(num / 62);
  }
  return arr.join("");
};

const CACHE_NAME = "app-data-cache";

const getFromCache = async (key) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(key);
  return response ? response.text() : null;
};

const setInCache = async (key, value) => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(value, {
    headers: { "Content-Type": "text/plain" },
  });
  await cache.put(key, response);
};

export const getTimestamp = async (id) => {
  let timestamp = await getFromCache("timestamp");
  const offset = fromBase62(id);
  return Number.parseInt(timestamp) + Number.parseInt(offset);
};

export const setAppId = async (appId) => {
  const appIdKey = "appId-default";
  await setInCache(appIdKey, appId);

  const timestamp = Date.now();
  await setInCache("timestamp", timestamp.toString());
};

export const getAppId = async () => {
  const appIdKey = "appId-default";
  let appId = await getFromCache(appIdKey);

  if (!appId) {
    const timestamp = Date.now();
    appId = toBase62(timestamp);
    await setAppId(appId);
    const userIdKey = `userId-${appId}`;
    await setInCache(userIdKey, 1);
  }

  return appId;
};

export const generateId = (appId) => {
  const referenceTimestamp = fromBase62(appId);
  if (!referenceTimestamp) {
    throw new Error(
      "Reference timestamp not set. Ensure getAppId has been called first.",
    );
  }

  const timeDifference = Date.now() - parseInt(referenceTimestamp, 10);
  let id = toBase62(timeDifference);

  while (id.length < 5) {
    id = "0" + id;
  }

  return id;
};

export const getUserId = async (appId) => {
  const userIdKey = `userId-${appId}`;
  const existingUserId = await getFromCache(userIdKey);
  if (existingUserId) return existingUserId;
  const id = generateId(appId);
  await setInCache(userIdKey, id);
  console.log({ userIdKey, id });
  return id;
};

export default { getAppId, getUserId, generateId, getTimestamp };
