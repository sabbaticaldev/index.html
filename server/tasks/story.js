import { downloadMedia } from "../services/drive.js";
import { fetchInstagramData } from "../services/instagram.js";

export default async function handleStory(url) {
  const storyId = new URL(url).pathname.split("/")[2];
  const data = await fetchInstagramData(url);
  const imagePath = await downloadMedia(data.image, storyId);
  // Process image, etc.
  console.log(`Processed story with image: ${imagePath}`);
}
