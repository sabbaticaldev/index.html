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

export const getTimestamp = (id) => {
  let timestamp = localStorage.getItem("timestamp");
  const offset = fromBase62(id);
  return Number.parseInt(timestamp) + Number.parseInt(offset);
};

const getAppId = () => {
  const existingAppId = localStorage.getItem("appId");
  if (existingAppId) return existingAppId;

  const timestamp = Date.now();
  localStorage.setItem("timestamp", timestamp.toString()); // Store the original timestamp for later reference

  const newAppId = toBase62(timestamp);
  localStorage.setItem("appId", newAppId);

  return newAppId;
};

const getUserId = () => {
  const existingUserId = localStorage.getItem("userId");
  if (existingUserId) return existingUserId;

  localStorage.setItem("userId", "1");
  return "1";
};

export const generateId = () => {
  const referenceTimestamp = localStorage.getItem("timestamp");
  if (!referenceTimestamp) {
    throw new Error(
      "Reference timestamp not set. Ensure getAppId has been called first.",
    );
  }

  const timeDifference = Date.now() - parseInt(referenceTimestamp, 10);
  return toBase62(timeDifference);
};

export const appId = getAppId();
export const userId = getUserId();

export default { appId, userId, generateId, getTimestamp };
