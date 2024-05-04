import { exec } from "child_process";
import fs from "fs";
import path from "path";

import { downloadMedia } from "../services/drive.js";
import { embedCaptionToImage,generateCaptionImage } from "../services/image.js";
import { fetchInstagramData, generateSocialMediaPost } from "../services/instagram.js";
import LLM from "../services/llm/index.js";
import { createGridVideo,embedCaptionToVideo } from "../services/video.js";
import { connectToWhatsApp, sendWhatsAppMessage } from "../services/whatsapp/index.js";
import settings from "../settings.js";
import { executeTasks }from "../utils.js";


const deps = {};

export async function createTopVideos(options) {
  const {
    url,
    duration = 3,
    captions = [],
    videos = [],
    captionStyle,
    contentStyle
  } = options;

  try {
    const baseId = new URL(url).pathname.split("/")[2];
    const outputFolderPath = `downloads/${baseId}/top_videos`;
    fs.mkdirSync(outputFolderPath, { recursive: true });

    const introVideoPath = path.join(outputFolderPath, "intro.mp4");
    const gridVideoPath = path.join(outputFolderPath, "grid.mp4");
    const finalVideoPath = path.join(outputFolderPath, "final.mp4");

    const tasks = [
      {
        description: "Download and prepare intro video",
        filePath: introVideoPath,
        operation: async () => downloadMedia(url, introVideoPath)
      },
      {
        description: "Create grid video from multiple sources",
        filePath: gridVideoPath,
        operation: async () => createGridVideo({
          videos,
          captions,
          outputPath: gridVideoPath,
          duration,
          style: captionStyle
        })
      },
      {
        description: "Combine intro and grid videos",
        filePath: finalVideoPath,
        dependencies: ["introVideo", "gridVideo"],
        operation: async () => {
          // Example command for combining videos sequentially with ffmpeg
          const command = `ffmpeg -f concat -safe 0 -i <(printf "file '%s'\nfile '%s'" ${introVideoPath} ${gridVideoPath}) -c copy ${finalVideoPath}`;
          await exec(command);
          return finalVideoPath;
        }
      },
      {
        description: "Send final video over WhatsApp",
        operation: async () => {
          const sock = await connectToWhatsApp({ keepAlive: true });
          await sendWhatsAppMessage(sock, { video: fs.readFileSync(finalVideoPath), text: "Check out the top places to visit!" }, settings.ADMIN_PHONE_NUMBER);
        }
      }
    ];

    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error(`Error creating top videos: ${error.message}`, { error });
  }
}

export async function createReelRipOff(options) {
  const { url, invert = true, pointSize = 26, 
    textColor = "white", strokeWidth = 2, captionBackground = "none", hashtags = true, 
    captionDuration, contentStyle, captionStyle, captionPadding,
    caption, captionPosition = "top", captionWidth = 600,
    secondaryCaption } = options;
  try {
    const reelId = new URL(url).pathname.split("/")[2];
    const outputFolderPath = `downloads/${reelId}`;
    fs.mkdirSync(outputFolderPath, { recursive: true });
    let captionConfig, captionPath;
    captionPath = path.join(outputFolderPath, "caption.png");
    captionConfig = {
      captionPosition,
      width: captionWidth,
      pointsize: pointSize,
      backgroundColor: captionBackground, 
      textColor: textColor, 
      strokeWidth: strokeWidth,
      padding: captionPadding,
      gravity: "center",
      font: "Rubik Mono One",      
      outputPath: captionPath
    };
    const instagramJSONPath = path.join(outputFolderPath, "instagram.json");
    const postPath = path.join(outputFolderPath, "llm.json");
    const videoPath = path.join(outputFolderPath, "video.mp4");
    const imagePath = path.join(outputFolderPath, "image.jpg");
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
          invert,
          outputPath: finalImagePath,
          secondaryCaption,
          captionPosition
        })
      },
      {
        description: "Video caption embedding",
        filePath: finalVideoPath,
        operation: async () => await embedCaptionToVideo({
          videoPath,
          captionPath,
          invert,
          outputPath: finalVideoPath,
          captionDuration,
          captionPosition
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


// TODO
export async function createMapImageWithEventPins(options) {
  
}