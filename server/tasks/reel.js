import fs from "fs";
import path from "path";

import { downloadMedia } from "../services/drive.js";
import { embedCaptionToImage,generateCaptionImage } from "../services/image.js";
import { fetchInstagramData, generateSocialMediaPost } from "../services/instagram.js";
import LLM from "../services/llm/index.js";
import { embedCaptionToVideo } from "../services/video.js";
import { connectToWhatsApp } from "../services/whatsapp.js";
import { sendWhatsAppMessage } from "../services/whatsapp.js";
import settings from "../settings.js";
import { executeTasks }from "../utils.js";


const deps = {};
export default async function handleReel(options) {
  const { url, hashtags = true, captionDuration, contentStyle, captionStyle, caption, captionPositon, captionWidth, secondaryCaption } = options;
  try {
    const reelId = new URL(url).pathname.split("/")[2];
    const outputFolderPath = `downloads/${reelId}`;
    fs.mkdirSync(outputFolderPath, { recursive: true });

    const captionConfig = {
      captionPosition: captionPositon || 300,
      width: captionWidth || 600,
      pointsize: 26,
      backgroundColor: "none", 
      textColor: "white", 
      strokeWidth: 2,
      gravity: "center",
      font: "Rubik Mono One",      
      outputPath: path.join(outputFolderPath, "caption.png")
    };
    
    const instagramJSONPath = path.join(outputFolderPath, "instagram.json");
    const postPath = path.join(outputFolderPath, "llm.json");
    const videoPath = path.join(outputFolderPath, "video.mp4");
    const imagePath = path.join(outputFolderPath, "image.jpg");
    const captionPath = path.join(outputFolderPath, "caption.png");
    const finalImagePath = path.join(outputFolderPath, "cover.png");
    const finalVideoPath = path.join(outputFolderPath, "final.mp4");
    const tasks = [
      {
        description: "Instagram data download",
        filePath: instagramJSONPath,
        key: "instagram",
        operation: async () => {
          const instagram = await fetchInstagramData(url);
          fs.writeFileSync(instagramJSONPath, JSON.stringify(instagram));
          return instagram;
        }
      },
      {
        description: "Video download",
        filePath: videoPath,
        dependencies: ["instagram"],
        operation: async () => await downloadMedia(deps.instagram.video, reelId, "video")
      },
      {
        description: "Image download",
        filePath: imagePath,
        dependencies: ["instagram"],
        operation: async () => await downloadMedia(deps.instagram.image, reelId, "image")
      },
      {
        description: "LLM post generation",
        filePath: postPath,
        key: "llm",
        dependencies: ["instagram"],
        operation: async () => {
          const llm = LLM("bedrock");
          const post = await generateSocialMediaPost(llm, { hashtags, contentStyle, captionStyle, postDescription: deps.instagram.description });
          
          fs.writeFileSync(postPath, JSON.stringify(post));
          return post;
        }
      },
      {
        description: "Caption image generation",
        filePath: captionPath,
        dependencies: ["llm"],
        operation: async () => {
          return await generateCaptionImage(caption || deps.llm.caption, captionConfig);
        }
      },
      {
        description: "Image caption embedding",
        filePath: finalImagePath,
        operation: () => embedCaptionToImage({
          imagePath,
          captionPath,
          outputPath: finalImagePath,
          secondaryCaption,
          top : captionConfig.captionPosition
        })
      },
      {
        description: "Video caption embedding",
        filePath: finalVideoPath,
        operation: async () => await embedCaptionToVideo({
          videoPath,
          captionPath,
          outputPath: finalVideoPath,
          captionDuration,
          top: captionConfig.captionPosition
        })
      },
      {
        description: "Send whatsapp messages",
        dependencies: ["llm"],
        operation: async () => {
          const sock = await connectToWhatsApp({ keepAlive: true });
          const messages = [
            { image: fs.readFileSync(imagePath) },
            { image: fs.readFileSync(finalImagePath) },
            { video: fs.readFileSync(videoPath) },
            { video: fs.readFileSync(finalVideoPath) },
            { text: deps.llm.description },
            { text: url }
          ];          
          await sendWhatsAppMessage({ sock, messages, phoneNumber: settings.ADMIN_PHONE_NUMBER });
        }
      }
    ];
    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error(`Error processing reel: ${error.message}`, { error });
  }
}

