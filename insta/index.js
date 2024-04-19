import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { fetchInstagramData, generateSocialMediaPost } from "./services/instagram.js";
import LLM from "./services/llm/index.js";
import { downloadVideo, embedSubtitles } from "./services/video.js";

const argv = yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .parse();

async function main(inputUrl) {
  try {
    let videoPath, description, reelId;

    if (inputUrl.includes("instagram.com")) {
      const url = new URL(inputUrl);
      reelId = url.pathname.split("/")[2];

      const data = await fetchInstagramData(inputUrl);
      videoPath = await downloadVideo(data.videoUrl, reelId);
      description = data.description;
    } else {
      videoPath = await downloadVideo(inputUrl, "custom");
      description = "Custom video file provided by user.";
    }
    const llm = LLM("bedrock");
    const { postContent, caption } = await generateSocialMediaPost(llm, description);
    const finalVideoPath = await embedSubtitles(videoPath, caption, argv.captionDuration, reelId);
  
    const outputFolderPath = path.join("downloads", reelId);
    fs.mkdirSync(outputFolderPath, { recursive: true });
    fs.writeFileSync(path.join(outputFolderPath, "post_content.txt"), postContent);
    fs.writeFileSync(path.join(outputFolderPath, "caption.txt"), caption);
  
    console.log(`New Post Content: ${postContent}`);
    console.log(`Caption: ${caption}`);
    console.log(`Final Video with Subtitles: ${finalVideoPath}`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Final Error: ${error.message}`, { error });
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  const videoUrl = process.argv[2]; // Node script.js <video_url>
  main(videoUrl).catch(console.error);
}