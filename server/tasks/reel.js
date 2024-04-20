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
import { sleep }from "../utils.js";

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
  // Helper function to wait for a specified amount of time

  // Function to send messages
  async function sendMessage() {
    try {
      if (sock.status !== "OPEN") {
        throw new Error("Socket is not open");
      }
      else {
        console.log("CONNECTION OPEN");
      }

      const { url, imagePath, videoPath, finalVideoPath, finalImagePath } = mediaPaths;      
      await sock.sendMessage(phoneNumber, { image: fs.readFileSync(imagePath) });
      await sock.sendMessage(phoneNumber, { image: fs.readFileSync(finalImagePath) });
      await sock.sendMessage(phoneNumber, { video: fs.readFileSync(videoPath) });
      await sock.sendMessage(phoneNumber, { video: fs.readFileSync(finalVideoPath) });
      await sock.sendMessage(phoneNumber, { text: description });
      await sock.sendMessage(phoneNumber, { text: url });
      console.log("Messages sent.");
    } catch (error) {
      if (error.message === "Socket is not open") {
        console.log("Socket is not open, waiting to retry...");
        await sleep(1000); 
        await sendMessage(); 
      }
      else {
        console.log("CLOSE CONNECTION");
        sock.end();
      }
    }
  }
  // Call the sendMessage function to initiate sending messages
  await sendMessage();
}


async function checkAndExecute(description, filePath, operation) {
  if (fs.existsSync(filePath)) {
    const redo = await promptUser(`File ${filePath} exists. Redo ${description}? (yes/no): `);
    if (!redo) {
      if (filePath.endsWith(".json")) {
        const fileContent = fs.readFileSync(filePath, "utf8");        
        return JSON.parse(fileContent);
      }
      return filePath;
    }
  }
  console.log("rodando operation", {description});
  return operation();
}
const jobs = {};
export default async function handleReel(url) {
  try {
    const reelId = new URL(url).pathname.split("/")[2];
    const outputFolderPath = `downloads/${reelId}`;
    fs.mkdirSync(outputFolderPath, { recursive: true });

    const captionConfig = {
      width: 700,
      pointsize: 36,
      backgroundColor: "white",
      textColor: "#333333",
      gravity: "center",
      font: "Rubik Mono One",
      top: 150,
      padding: 20,
      outputPath: path.join(outputFolderPath, "caption.png")
    };
    const instagramJSONPath = path.join(outputFolderPath, "instagram.json");
    const postPath = path.join(outputFolderPath, "llm.json");
    const videoPath = path.join(outputFolderPath, "video.mp4");
    const imagePath = path.join(outputFolderPath, "image.jpg");
    const captionPath = path.join(outputFolderPath, "caption.png");
    const tasks = [
      {
        description: "Instagram data download",
        filePath: path.join(outputFolderPath, "instagram.json"),
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
        operation: async () => await downloadMedia(jobs.instagram.video, reelId, "video")
      },
      {
        description: "Image download",
        filePath: imagePath,
        dependencies: ["instagram"],
        operation: async () => await downloadMedia(jobs.instagram.image, reelId, "image")
      },
      {
        description: "LLM post generation",
        filePath: path.join(outputFolderPath, "llm.json"),
        key: "llm",
        dependencies: ["instagram"],
        operation: async () => {
          const llm = LLM("bedrock");
          const post = await generateSocialMediaPost(llm, jobs.instagram.description);
          
          fs.writeFileSync(postPath, JSON.stringify(post));
          return post;
        }
      },
      {
        description: "Caption image generation",
        filePath: path.join(outputFolderPath, "caption.png"),
        dependencies: ["llm"],
        operation: async () => {
          return await generateCaptionImage(jobs.llm.caption, captionConfig);
        }
      },
      {
        description: "Video caption embedding",
        filePath: path.join(outputFolderPath, "final.mp4"),
        operation: async () => await embedCaptionToVideo({
          videoPath,
          captionPath,
          outputPath: path.join(outputFolderPath, "final.mp4")
        })
      },
      {
        description: "Image caption embedding",
        filePath: path.join(outputFolderPath, "cover.png"),
        operation: () => embedCaptionToImage({
          imagePath,
          captionPath,
          outputPath: path.join(outputFolderPath, "cover.png"),
          top: 150
        })
      }
    ];

    await executeTasks(tasks);
    console.log("START WHATSAPP");
    const sock = await connectToWhatsApp({ keepAlive: true });
    await sendWhatsAppMessage(sock, { url, videoPath, imagePath, finalVideoPath: `${outputFolderPath}/final.mp4`, finalImagePath: `${outputFolderPath}/cover.png` }, jobs.llm.description, settings.ADMIN_PHONE_NUMBER);
    console.log(`Processed reel: ${jobs.instagram.description}`);
    console.log(`Caption: ${jobs.llm.caption}`);
    console.log(`Final Video with Caption: ${outputFolderPath}/final.mp4`);
    console.log(`Final Image with Caption: ${outputFolderPath}/cover.png`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Error processing reel: ${error.message}`, { error });
  } finally {
    rl.close();
  }
}

// Execute tasks considering dependencies
async function executeTasks(taskList) {
  for (const task of taskList) {
    if (task.dependencies) {
      await Promise.all(task.dependencies.map(dep => jobs[dep]));
    }    
    const result = await checkAndExecute(task.description, task.filePath, task.operation);
    if(task.key) {
      console.log({result});
      jobs[task.key] = result;
    }
  }
}