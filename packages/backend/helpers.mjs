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

const getAppId = async () => {
  const existingAppId = await getFromCache("appId");
  if (existingAppId) return existingAppId;

  const timestamp = Date.now();
  await setInCache("timestamp", timestamp.toString());

  const newAppId = toBase62(timestamp);
  await setInCache("appId", newAppId);

  return newAppId;
};

const getUserId = async () => {
  const existingUserId = await getFromCache("userId");
  if (existingUserId) return existingUserId;

  await setInCache("userId", "1");
  return "1";
};

export const generateId = async () => {
  const referenceTimestamp = await getFromCache("timestamp");
  if (!referenceTimestamp) {
    throw new Error(
      "Reference timestamp not set. Ensure getAppId has been called first.",
    );
  }

  const timeDifference = Date.now() - parseInt(referenceTimestamp, 10);
  return toBase62(timeDifference);
};

// Rest of your code remains the same

export default { getAppId, getUserId, generateId, getTimestamp };
