
import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import path from "path";

export async function downloadMedia(url, postId, mediaType) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
  
  // Extract the filename from the URL, remove any query string, and get the extension
  const urlPath = new URL(url).pathname;
  const cleanPath = urlPath.split("?")[0];  // Remove any query string
  let extension = path.extname(cleanPath);

  // Ensure the directory for the postId exists
  const mediaDir = path.join("downloads", postId);
  fs.mkdirSync(mediaDir, { recursive: true });
  // Use a generic filename based on media type
  const filename = mediaType === "video" ? `video${extension}` : `image${extension}`;

  // Set the path to save the file
  const mediaPath = path.join(mediaDir, filename);
  
  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(mediaPath);
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
  
  return mediaPath;
}
