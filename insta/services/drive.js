import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import path from "path";

export async function downloadMedia(url, postId) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
    
  // Extract the filename from the URL and remove any query string
  const urlPath = new URL(url).pathname;
  const filename = path.basename(urlPath).split("?")[0];
  
  // Ensure the directory for the postId exists
  const mediaDir = path.join("downloads", postId);
  fs.mkdirSync(mediaDir, { recursive: true });
    
  // Set the path to save the file with its original name
  const mediaPath = path.join(mediaDir, filename);
  
  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(mediaPath);
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
  
  return mediaPath;
}
  