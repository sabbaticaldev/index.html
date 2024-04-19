import fs from "fs";
import path from "path";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { downloadMedia } from "./services/drive.js";
import { embedCaptionToImage,generateCaptionImage } from "./services/image.js";
import { fetchInstagramData, generateSocialMediaPost } from "./services/instagram.js";
import LLM from "./services/llm/index.js";
import { embedCaptionToVideo } from "./services/video.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const argv = yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .parse();

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function checkAndExecute(description, path, operation, forceRedo = false) {
  if (fs.existsSync(path) && !forceRedo) {
    const redo = await promptUser(`File ${path} exists. Redo ${description}? (yes/no): `);
    if (!redo) {
      if (path.endsWith(".json")) {
        const fileContent = fs.readFileSync(path, "utf8");
        return JSON.parse(fileContent);
      }
      return path;
    }
  }
  return operation();
}


async function main(inputUrl) {
  try {
    if (!inputUrl.includes("instagram.com")) throw "Invalid URL";

    const url = new URL(inputUrl);
    const reelId = url.pathname.split("/")[2];
    const outputFolderPath = path.join("downloads", reelId);
    fs.mkdirSync(outputFolderPath, { recursive: true });
    const postJSON = path.join(outputFolderPath, "instagram.json");
    const data = await checkAndExecute("instagram data download", postJSON, () => fetchInstagramData(inputUrl));    

    fs.mkdirSync(outputFolderPath, { recursive: true });
    console.log({data});    
    fs.writeFileSync(postJSON, JSON.stringify(data));
    
    const videoPath = await checkAndExecute("video download", path.join(outputFolderPath, "video.mp4"), () => downloadMedia(data.video, reelId));
    const imagePath = await checkAndExecute("image download", path.join(outputFolderPath, "cover.jpg"), () => downloadMedia(data.image, reelId));
    const post = await checkAndExecute("LLM generate post", path.join(outputFolderPath, "llm.json"), async () => {
      const llm = LLM("bedrock");
      return generateSocialMediaPost(llm, data.description);

    });

    fs.writeFileSync(path.join(outputFolderPath, "llm.json"), JSON.stringify(post));
    console.log({post, data});
    const captionPath = await checkAndExecute("caption generation", path.join(outputFolderPath, "caption.png"), () => generateCaptionImage(post.caption, {
      width: 800,
      pointsize: 45,
      backgroundColor: "white",
      textColor: "#444444",
      gravity: "center",
      font: "Rubik Mono One",
      top: 150,
      padding: 20,
      outputPath: path.join(outputFolderPath, "caption.png")
    }));

    const finalVideoPath = await embedCaptionToVideo({
      videoPath, captionPath, duration: argv.captionDuration, outputPath: path.join(outputFolderPath, "final.mp4")
    });

    const finalImagePath = await embedCaptionToImage({
      imagePath, captionPath, outputPath: path.join(outputFolderPath, "cover.png"), top: 150
    });

    console.log(`New Post Content: ${post.description}`);
    console.log(`Caption: ${post.caption}`);
    console.log(`Final Video with Caption: ${finalVideoPath}`);
    console.log(`Final Image with Caption: ${finalImagePath}`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Final Error: ${error.message}`, { error });
  } finally {
    rl.close();
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  main(process.argv[2]).catch(console.error);
}
