import { LLM, prompt } from "aiflow/utils/llm.js";
import { executeTasks } from "aiflow/utils/tasks.js";
import fs from "fs";
import path from "path";

import { downloadMedia } from "../../server/services/drive.js";
import {
  embedCaptionToImage,
  generateCaptionImage,
} from "../../server/services/image.js";
import { fetchInstagramData } from "../../server/services/instagram.js";
import { embedCaptionToVideo } from "../../server/services/video.js";
import {
  connectToWhatsApp,
  sendWhatsAppMessage,
} from "../../server/services/whatsapp/index.js";
import settings from "../../server/settings.js";

const deps = {};

export default async (options) => {
  const {
    url,
    invert = true,
    pointSize = 26,
    textColor = "white",
    strokeWidth = 2,
    captionBackground = "none",
    hashtags = true,
    captionDuration,
    contentStyle,
    captionStyle,
    captionPadding,
    caption,
    captionPosition = "top",
    captionWidth = 600,
    secondaryCaption,
  } = options;

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
      outputPath: captionPath,
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
        },
      },
      {
        description: "Video download",
        filePath: videoPath,
        dependencies: ["instagram"],
        operation: async () =>
          await downloadMedia(deps.instagram.video, reelId, "video"),
      },
      {
        description: "Image download",
        filePath: imagePath,
        dependencies: ["instagram"],
        operation: async () =>
          await downloadMedia(deps.instagram.image, reelId, "image"),
      },
      {
        description: "LLM post generation",
        filePath: postPath,
        key: "llm",
        dependencies: ["instagram"],
        operation: async () => {
          const promptMessage = await prompt("social-media-post", {
            postDescription: deps.instagram.description,
            contentStyle,
            captionStyle,
            persona: "AllForTraveler",
            hashtags,
          });

          const post = await LLM.execute("bedrock", promptMessage);
          fs.writeFileSync(postPath, JSON.stringify(post));
          return post;
        },
      },
      {
        description: "Caption image generation",
        filePath: captionPath,
        dependencies: ["llm"],
        operation: async () => {
          return await generateCaptionImage(
            caption || deps.llm.caption,
            captionConfig,
          );
        },
      },
      {
        description: "Image caption embedding",
        filePath: finalImagePath,
        operation: () =>
          embedCaptionToImage({
            imagePath,
            captionPath,
            invert,
            outputPath: finalImagePath,
            secondaryCaption,
            captionPosition,
          }),
      },
      {
        description: "Video caption embedding",
        filePath: finalVideoPath,
        operation: async () =>
          await embedCaptionToVideo({
            videoPath,
            captionPath,
            invert,
            outputPath: finalVideoPath,
            captionDuration,
            captionPosition,
          }),
      },
      {
        description: "Send WhatsApp messages",
        dependencies: ["llm"],
        operation: async () => {
          const sock = await connectToWhatsApp({ keepAlive: true });
          const messages = [
            { image: fs.readFileSync(imagePath) },
            { image: fs.readFileSync(finalImagePath) },
            { video: fs.readFileSync(videoPath) },
            { video: fs.readFileSync(finalVideoPath) },
            { text: deps.llm.description },
            { text: url },
          ];
          await sendWhatsAppMessage({
            sock,
            messages,
            phoneNumber: settings.ADMIN_PHONE_NUMBER,
          });
        },
      },
    ];

    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error(`Error processing reel: ${error.message}`, { error });
  }
};