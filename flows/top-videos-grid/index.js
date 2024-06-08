import { exec } from "child_process";
import fs from "fs";
import path from "path";

import { downloadMedia } from "../../server/services/drive.js";
import { createGridVideo } from "../../server/services/video.js";
import {
  connectToWhatsApp,
  sendWhatsAppMessage,
} from "../../server/services/whatsapp/index.js";
import settings from "../../server/settings.js";
import { executeTasks } from "../../server/utils.js";

const deps = {};

export default async (options) => {
  const {
    url,
    duration = 3,
    captions = [],
    videos = [],
    captionStyle,
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
        operation: async () => downloadMedia(url, introVideoPath),
      },
      {
        description: "Create grid video from multiple sources",
        filePath: gridVideoPath,
        operation: async () =>
          createGridVideo({
            videos,
            captions,
            outputPath: gridVideoPath,
            duration,
            style: captionStyle,
          }),
      },
      {
        description: "Combine intro and grid videos",
        filePath: finalVideoPath,
        dependencies: ["introVideo", "gridVideo"],
        operation: async () => {
          const command = `ffmpeg -f concat -safe 0 -i <(printf "file '%s'\\nfile '%s'" ${introVideoPath} ${gridVideoPath}) -c copy ${finalVideoPath}`;
          await exec(command);
          return finalVideoPath;
        },
      },
      {
        description: "Send final video over WhatsApp",
        operation: async () => {
          const sock = await connectToWhatsApp({ keepAlive: true });
          await sendWhatsAppMessage(
            sock,
            {
              video: fs.readFileSync(finalVideoPath),
              text: "Check out the top places to visit!",
            },
            settings.ADMIN_PHONE_NUMBER,
          );
        },
      },
    ];

    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error(`Error creating top videos: ${error.message}`, { error });
  }
};
