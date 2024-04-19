import { BedrockClient, StartTextGenerationCommand } from "@aws-sdk/client-bedrock"; // Assuming AWS SDK Bedrock client
import AWS from "aws-sdk";
import { config } from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import openai from "openai";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Initialize AWS Bedrock Client
const bedrockClient = new BedrockClient({ region: process.env.AWS_REGION });

const argv = yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .parse();

config(); // Loads environment variables from .env file
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
openai.apiKey = process.env.OPENAI_API_KEY;
// Function to download video from a URL
async function downloadVideo(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);

  const videoPath = `downloads/video-${Date.now()}.mp4`;
  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(videoPath);
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
  return videoPath;
}

  
async function fetchInstagramData(url) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "example-rapidapi-host.com"
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(`Failed to fetch data from Instagram: ${response.statusText}`);

  return {
    videoUrl: data.videoUrl,
    description: data.description
  };
}

async function generateSocialMediaPost(description) {
  const prompt = `Create a social media post using the following description: "${description}" \r\n
    Change the tone and expand the content from the point of the view of a guide (called AllForTraveler.com), also adding a call to action in the end and then include a good amount of relevant hashtags.
    We want to motivate people to go explore the world.
    If there is a mention (@username) in the description, keep the mention to keep credits to the rightful creator
    `;
  
  const command = new StartTextGenerationCommand({
    Text: prompt,
    ModelId: process.env.BEDROCK_MODEL_ID, 
    MaxTokens: 1000
  });
  
  try {
    const response = await bedrockClient.send(command);
    return response.GeneratedText.trim(); // Assuming the response format
  } catch (error) {
    console.error("Error generating text with AWS Bedrock:", error);
    throw error;
  }
}

async function embedSubtitles(videoPath, transcription, duration) {
  const subtitlesPath = `downloads/subtitles-${Date.now()}.srt`;
  const outputVideoPath = `downloads/final-${Date.now()}.mp4`;
  
  // Get video duration
  const videoDuration = await getVideoDuration(videoPath);
  const durationInSeconds = duration || videoDuration;
  
  // Generate SRT content
  const srtContent = generateSRT(transcription, durationInSeconds);
  fs.writeFileSync(subtitlesPath, srtContent);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputVideoPath)
      .noAudio()
      .outputOptions(["-vf", `subtitles=${subtitlesPath}`])
      .on("end", () => resolve(outputVideoPath))
      .on("error", (err) => reject(err))
      .run();
  });
}
  
async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      resolve(Math.floor(metadata.format.duration));
    });
  });
}

function generateSRT(transcription, durationInSeconds) {
  const endHrs = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
  const endMin = Math.floor((durationInSeconds % 3600) / 60).toString().padStart(2, "0");
  const endSec = (durationInSeconds % 60).toString().padStart(2, "0");
  let srt = `1\n00:00:00,000 --> ${endHrs}:${endMin}:${endSec},000\n${transcription}\n`;
  return srt;
}

// Main function to orchestrate all steps
async function main(inputUrl) {
  try {
    let videoPath, description;
    if (inputUrl.includes("instagram.com")) {
      const data = await fetchInstagramData(inputUrl);
      videoPath = await downloadVideo(data.videoUrl);
      description = data.description;
    } else {
      videoPath = await downloadVideo(inputUrl);
      description = "Custom video file provided by user.";
    }
  
    const newPostContent = await generateSocialMediaPost(description);
    const finalVideoPath = await embedSubtitles(videoPath, newPostContent, argv.captionDuration);
  
    console.log(`New Post Content: ${newPostContent}`);
    console.log(`Final Video with Subtitles and No Audio: ${finalVideoPath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  const videoUrl = process.argv[2]; // Node script.js <video_url>
  main(videoUrl).catch(console.error);
}