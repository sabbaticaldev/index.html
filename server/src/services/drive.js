import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import path from "path";

export const downloadMedia = async (url, postId, mediaType) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch media: ${response.statusText}`);

  const urlPath = new URL(url).pathname.split("?")[0];
  const extension = path.extname(urlPath);

  const mediaDir = path.join("downloads", postId);
  fs.mkdirSync(mediaDir, { recursive: true });
  const filename =
    mediaType === "video" ? `video${extension}` : `image${extension}`;
  const mediaPath = path.join(mediaDir, filename);

  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(mediaPath);
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });

  return mediaPath;
};
