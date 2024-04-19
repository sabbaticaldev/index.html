
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import path from "path";



export async function downloadVideo(url, reelId) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
    
  const videoDir = path.join("downloads", reelId);
  fs.mkdirSync(videoDir, { recursive: true });
    
  const videoPath = path.join(videoDir, "video.mp4");
  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(videoPath);
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
    
  return videoPath;
}

export async function embedSubtitles(videoPath, caption, duration, reelId) {
  const subtitlesPath = path.join("downloads", reelId, "subtitles.srt");
  const outputVideoPath = path.join("downloads", reelId, "final.mp4");
  
  // Get video duration
  const videoDuration = await getVideoDuration(videoPath);
  const durationInSeconds = duration || videoDuration;
  
  // Generate SRT content
  const srtContent = generateSRT(caption, durationInSeconds);
  fs.writeFileSync(subtitlesPath, srtContent);
  
  return new Promise((resolve, reject) => {
    try {
      ffmpeg(videoPath)
        .noAudio()  // Ensure no audio is included in the output video
        .videoFilters([
          {
            filter: "drawtext",
            options: {
              text: caption,
              fontfile: "roboto.ttf",  
              fontsize: 60,
              fontcolor: "#333333",
              x: "(w-text_w)/2",
              y: "150",  // Adjust position to top, 30 pixels from the top
              box: 1,  // Enable background box
              boxcolor: "white@0.5",  // White background with 50% opacity
              boxborderw: 10|20
            }
          }
        ])
        .output(outputVideoPath)
        .on("end", () => resolve(outputVideoPath))
        .on("error", (err) => reject(err))
        .run();
    }
    catch (error){console.error({error});}
  });
}
  
export async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      resolve(Math.floor(metadata.format.duration));
    });
  });
}

export function generateSRT(caption, durationInSeconds) {
  const endHrs = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
  const endMin = Math.floor((durationInSeconds % 3600) / 60).toString().padStart(2, "0");
  const endSec = (durationInSeconds % 60).toString().padStart(2, "0");
  let srt = `1\n00:00:00,000 --> ${endHrs}:${endMin}:${endSec},000\n${caption}\n`;
  return srt;
}
