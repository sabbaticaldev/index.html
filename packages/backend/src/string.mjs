const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export let sequentialCounter = 0;

export const generateIdByTimestamp = (timestamp) => {
  if (!timestamp) {
    throw new Error(
      "Reference timestamp not set. Ensure getAppId has been called first.",
    );
  }

  const timeDifference = Date.now() - parseInt(timestamp, 10);
  let id = toBase62(timeDifference + sequentialCounter);
  sequentialCounter++;
  return id;
};

export const generateId = (appId, userId) => {
  const referenceTimestamp = fromBase62(appId);
  let id = generateIdByTimestamp(referenceTimestamp);
  return userId ? `${userId}-${id}` : id;
};

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

export const updateIndexPosition = function (indexStr = "", taskId, position) {
  const tasksArray = indexStr.split("|");

  // Remove the task if it exists
  const index = tasksArray.indexOf(taskId);
  if (index !== -1) {
    tasksArray.splice(index, 1);
  }

  // Correct the position if it's out of range
  const correctedPosition = Math.min(position, tasksArray.length);

  // Insert task at the new position
  tasksArray.splice(correctedPosition, 0, taskId);

  return tasksArray.join("|");
};

export const removeIndexItem = function (indexStr = "", taskId) {
  const tasksArray = indexStr.split("|");
  const index = tasksArray.indexOf(taskId);
  if (index !== -1) {
    tasksArray.splice(index, 1);
  }
  return tasksArray.join("|");
};
