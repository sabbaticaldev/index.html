import fs from "fs";
import path from "path";

import { AnimateImage } from "../services/image.js";
import { connectToWhatsApp, sendWhatsAppMessage } from "../services/whatsapp/index.js";
import settings from "../settings.js";
import { executeTasks } from "../utils.js";

const deps = {};

export async function CreateVideoFromImage(options) {
  const {
    url: imagePath,
    duration = 10,
    frameRate = 24,
    zoomLevel = 1.2,
    panDirection = "left-to-right",
    startPosition = "center",
    endPosition = "center",
    resolution = "1920x1080",
    messageText = "Check out this animation!"
  } = options;

  try {
    const baseId = path.basename(imagePath, path.extname(imagePath));
    const outputFolderPath = `downloads/${baseId}`;
    fs.mkdirSync(outputFolderPath, { recursive: true });

    const animatedVideoPath = path.join(outputFolderPath, `${baseId}_animated.mp4`);

    const tasks = [
      {
        description: "Create animated video from image",
        filePath: animatedVideoPath,
        operation: async () => AnimateImage({
          imagePath,
          outputPath: animatedVideoPath,
          duration,
          frameRate,
          zoomLevel,
          panDirection,
          startPosition,
          endPosition,
          resolution
        })
      },
      {
        description: "Send animated video over WhatsApp",
        dependencies: ["animatedVideo"],
        operation: async () => {
          const sock = await connectToWhatsApp({ keepAlive: true });
          await sendWhatsAppMessage(sock, [{ video: fs.readFileSync(animatedVideoPath), text: messageText }], settings.ADMIN_PHONE_NUMBER);
        }
      }
    ];

    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error(`Error creating video from image: ${error.message}`, { error });
  }
}
