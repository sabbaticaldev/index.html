// tasks/reel.js
import fs from "fs";
import path from "path";
import readline from "readline";

import { connectToWhatsApp } from "../services/baileys.js";
import { downloadMedia } from "../services/drive.js";
import { embedCaptionToImage,generateCaptionImage } from "../services/image.js";
import { fetchInstagramData, generateSocialMediaPost } from "../services/instagram.js";
import LLM from "../services/llm/index.js";
import { embedCaptionToVideo } from "../services/video.js";
import settings from "../settings.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(["yes", "y", "1"].includes(answer.trim().toLowerCase()));
    });
  });
}

async function sendWhatsAppMessage(sock, mediaPaths, description, phoneNumber) {
  try {
    const { imagePath, videoPath } = mediaPaths;

    // Send Image
    const imageStream = fs.createReadStream(imagePath);
    const { messageID: imageMsgId } = await sock.sendMessage(phoneNumber, { image: imageStream, caption: description });

    // Send Video
    const videoStream = fs.createReadStream(videoPath);
    const { messageID: videoMsgId } = await sock.sendMessage(phoneNumber, { video: videoStream, caption: description });

    console.log(`Messages sent with IDs: Image - ${imageMsgId}, Video - ${videoMsgId}`);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}


async function checkAndExecute(description, filePath, operation) {
  if (fs.existsSync(filePath)) {
    const redo = await promptUser(`File ${filePath} exists. Redo ${description}? (yes/no): `);
    if (!redo) {
      console.log({redo});
      if (filePath.endsWith(".json")) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        console.log("retorno");
        return JSON.parse(fileContent);
      }
      console.log("retorno 2");
      return filePath;
    }
  }
  console.log("rodando operation", {description});
  return operation();
}

export default async function handleReel(url) {
  try {
    const reelId = new URL(url).pathname.split("/")[2];
    const outputFolderPath = `downloads/${reelId}`;
    fs.mkdirSync(outputFolderPath, { recursive: true });

    const instagramJSONPath = path.join(outputFolderPath, "instagram.json");
    const data = await checkAndExecute("Instagram data download", instagramJSONPath, () => fetchInstagramData(url));
    fs.writeFileSync(instagramJSONPath, JSON.stringify(data));

    const videoPath = await checkAndExecute("Video download", path.join(outputFolderPath, "video.mp4"), () => downloadMedia(data.video, reelId, "video"));
    const imagePath = await checkAndExecute("image download", path.join(outputFolderPath, "image.jpg"), () => downloadMedia(data.image, reelId, "image"));    
    const postPath = path.join(outputFolderPath, "post.json");
    const post = await checkAndExecute("LLM post generation", postPath, () => { 
      const llm = LLM("bedrock");
      console.log("RODANDO ESSA BOSTA", {postPath});
      return generateSocialMediaPost(llm, data.description);
    });
    fs.writeFileSync(postPath, JSON.stringify(post));

    const captionConfig = {
      width: 800,
      pointsize: 45,
      backgroundColor: "white",
      textColor: "#444444",
      gravity: "center",
      font: "Rubik Mono One",
      top: 150,
      padding: 20,
      outputPath: path.join(outputFolderPath, "caption.png")
    };
    const captionPath = await checkAndExecute("Caption image generation", captionConfig.outputPath, () => generateCaptionImage(post.caption, captionConfig));

    const finalVideoPath = await embedCaptionToVideo({
      videoPath,
      captionPath,
      outputPath: path.join(outputFolderPath, "final.mp4")
    });

    const finalImagePath = await embedCaptionToImage({
      imagePath, captionPath, outputPath: path.join(outputFolderPath, "cover.png"), top: 150
    });

    const sock = await connectToWhatsApp();
    sendWhatsAppMessage(sock, { videoPath, imagePath }, data.description, settings.ADMIN_PHONE_NUMBER);
    console.log(`Processed reel: ${data.description}`);
    console.log(`Caption: ${post.caption}`);
    console.log(`Final Video with Caption: ${finalVideoPath}`);
    console.log(`Final Image with Caption: ${finalImagePath}`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Error processing reel: ${error.message}`, { error });
  } finally {
    rl.close();
  }
}
