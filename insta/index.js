import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { downloadMedia } from "./services/drive.js";
import { generateCaptionImage } from "./services/image.js";
import { embedCaptionToImage } from "./services/image.js";
import { fetchInstagramData, generateSocialMediaPost } from "./services/instagram.js";
import LLM from "./services/llm/index.js";
import { embedCaptionToVideo } from "./services/video.js";

const argv = yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .parse();

async function main(inputUrl) {
  try {
    
    if (!inputUrl.includes("instagram.com")) {
      throw "invalid URL";
    }
    const url = new URL(inputUrl);
    const reelId = url.pathname.split("/")[2];

    const data = await fetchInstagramData(inputUrl);
    const videoPath = await downloadMedia(data.video, reelId);
    const description = data.description;
    const imagePath = await downloadMedia(data.image, reelId);
    const llm = LLM("bedrock");
    const post = await generateSocialMediaPost(llm, description);
    const captionConfig = {
      width: 800,
      pointsize: 45,
      backgroundColor: "white",
      textColor: "#444444",
      gravity: "center",
      font: "Rubik Mono One",
      top: 150,
      padding: 20,
      outputPath: path.join("downloads", reelId, "caption.png")
    };
    const captionPath = await generateCaptionImage(post.caption, captionConfig);
    const finalVideoPath = await embedCaptionToVideo({videoPath, captionPath, outputPath:path.join("downloads", reelId, "final.mp4"), duration: argv.captionDuration});
    const finalImagePath = await embedCaptionToImage({...captionConfig, imagePath, captionPath, outputPath: path.join("downloads", reelId, "cover.png")});
  
    const outputFolderPath = path.join("downloads", reelId);
    fs.mkdirSync(outputFolderPath, { recursive: true });
    fs.writeFileSync(path.join(outputFolderPath, "post.txt"), post.description);
  
    console.log(`New Post Content: ${post.description}`);
    console.log(`Caption: ${post.caption}`);
    console.log(`Final Video with Caption: ${finalVideoPath}`);
    console.log(`Final Image with Caption: ${finalImagePath}`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Final Error: ${error.message}`, { error });
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  const videoUrl = process.argv[2]; // Node script.js <video_url>
  main(videoUrl).catch(console.error);
}