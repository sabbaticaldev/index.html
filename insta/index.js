import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { config } from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

config(); 

const textDecoder = new TextDecoder("utf-8");

const bedrockClient = new BedrockRuntimeClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const argv = yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .parse();



async function downloadVideo(url, reelId) {
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
async function fetchInstagramData(url) {
  const data = {
    video: "https://instagram.fevn6-1.fna.fbcdn.net/v/t66.30100-16/333801532_374412942121516_1667624729883475771_n.mp4?_nc_ht=instagram.fevn6-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=qUQR0vqakLUAb53e-pO&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfCxG4B2y0nURWmanJH_KoZXC2S0HO2sc3G6PHCEH-FGyA&oe=6623D19A&_nc_sid=2999b8",
    height: 1920,
    width: 1080,
    image: "https://instagram.fevn6-6.fna.fbcdn.net/v/t51.29350-15/430149534_388786123910690_7516578881301407388_n.jpg?stp=dst-jpg_e15_fr_p1080x1080&_nc_ht=instagram.fevn6-6.fna.fbcdn.net&_nc_cat=102&_nc_ohc=6TjXlAOEo0MAb7Bhyhs&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfDqYn7vyFh8R85E9siiGutg3ujN_yyO85P7TOVNtkmn_w&oe=6623B3D5&_nc_sid=2999b8",
    caption: "By far the best hike in Switzerland 🇨🇭\n" +
      "\n" +
      "This 35 km hike offers breathtaking views of the Swiss Alps, Jungfrau peaks and Brienz lake during more than 10 hours. \n" +
      "\n" +
      "Be aware that this trail is considered one of the most dangerous trail in Switzerland.\n" +
      "\n" +
      "🎥 @lazyset_up \n" +
      "\n" +
      "#berneroberland #switzerland #mountainlife #mountainlovers #hikingbangers #mountainadventures #welivetoexplore #exploreswitzerland #brienz #beautifuldestinations #switzerland #hardergrat #hikingtheglobe #earthfocus #wilderness #visitswitzerland #swissmountains #alps #naturelovers #keepitwild #awakethesoul #wondermore #swissalps #stayandwander #bucketlist #explorepage #foryou #reelstrending #roamtheplanet"
  };
  if(!data) {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_API
      }
    };
    const endpoint = "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php";
    const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(`Failed to fetch data from Instagram: ${response.statusText}`);
  }
  return {
    videoUrl: data.video,
    description: data.caption
  };
}

async function generateSocialMediaPost(description) {
  const prompt = `Create a social media post using the following description: "${description}". 
    Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that share traveling tips), 
    also adding a call to action in the end and then include a good amount of relevant hashtags, be picky and select some top traveling hashtags and a few mid-level. Max 10 hashtags. 
    We want to motivate people to go explore the world.  But be careful and don't make wrong assumptions, we aren't a tour guide officially, we just share motivational videos
    If there is a mention (@username) in the description, keep the mention to give credit to the rightful creator.
    Also, generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words.
    Give the response in the JSON format: { caption, description, tags, credits }`;
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      {
        role: "user",
        content: [{
          type: "text",
          text: prompt,
        }],
      },
    ],
    system: "answer in English",
    max_tokens: 2048,
    temperature: 0.5,
    top_k: 250,
    top_p: 1,
    stop_sequences: ["\\n\\nHuman:"],
  };
  const params = {
    modelId: process.env.BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  };

  try {
    console.log({body});
    const data = await bedrockClient.send(new InvokeModelCommand(params));

    if (!data) {
      throw new Error("AWS Bedrock Runtime Error");
    } else {
      const response = JSON.parse(textDecoder.decode(data.body));
      console.log({response});
      if(!response?.content[0].text)
        throw "Error: Invalid response";
      const content = JSON.parse(response?.content[0].text);
      console.log({content});
      const {caption, credits} = content;
      return { postContent: content.description, caption, credits };
    }
  } catch (error) {
    console.error("Error generating text with AWS Bedrock Runtime:", error);
    throw error;
  }
}
async function embedSubtitles(videoPath, caption, duration) {
  const subtitlesPath = path.join("downloads", `subtitles-${Date.now()}.srt`);
  const outputVideoPath = path.join("downloads", `final-${Date.now()}.mp4`);
  
  // Get video duration
  const videoDuration = await getVideoDuration(videoPath);
  const durationInSeconds = duration || videoDuration;
  
  // Generate SRT content
  const srtContent = generateSRT(caption, durationInSeconds);
  fs.writeFileSync(subtitlesPath, srtContent);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noAudio()  // Ensure no audio is included in the output video
      .videoFilters([
        {
          filter: "drawtext",
          options: {
            text: caption,
            fontfile: "./roboto.ttf",  // Specify the path to your font file
            fontsize: 60,
            fontcolor: "black",
            x: "(w-text_w)/2",
            y: "30",  // Adjust position to top, 30 pixels from the top
            box: 1,  // Enable background box
            boxcolor: "white@0.5",  // White background with 50% opacity
            boxborderw: 5
          }
        }
      ])
      .output(outputVideoPath)
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

function generateSRT(caption, durationInSeconds) {
  const endHrs = Math.floor(durationInSeconds / 3600).toString().padStart(2, "0");
  const endMin = Math.floor((durationInSeconds % 3600) / 60).toString().padStart(2, "0");
  const endSec = (durationInSeconds % 60).toString().padStart(2, "0");
  let srt = `1\n00:00:00,000 --> ${endHrs}:${endMin}:${endSec},000\n${caption}\n`;
  return srt;
}

// Main function to orchestrate all steps
async function main(inputUrl) {
  try {
    let videoPath, description, reelId;

    if (inputUrl.includes("instagram.com")) {
      const url = new URL(inputUrl);
      reelId = url.pathname.split("/")[2];

      const data = await fetchInstagramData(inputUrl);
      videoPath = await downloadVideo(data.videoUrl, reelId);
      description = data.description;
    } else {
      videoPath = await downloadVideo(inputUrl, "custom");
      description = "Custom video file provided by user.";
    }

    const { postContent, caption } = await generateSocialMediaPost(description);
    const finalVideoPath = await embedSubtitles(videoPath, caption, argv.captionDuration);
  
    const outputFolderPath = path.join("downloads", reelId);
    fs.mkdirSync(outputFolderPath, { recursive: true });
    fs.writeFileSync(path.join(outputFolderPath, "post_content.txt"), postContent);
    fs.writeFileSync(path.join(outputFolderPath, "caption.txt"), caption);
    fs.copyFileSync(finalVideoPath, path.join(outputFolderPath, "final_video.mp4"));
  
    console.log(`New Post Content: ${postContent}`);
    console.log(`Caption: ${caption}`);
    console.log(`Final Video with Subtitles: ${finalVideoPath}`);
    console.log(`Output saved in: ${outputFolderPath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  const videoUrl = process.argv[2]; // Node script.js <video_url>
  main(videoUrl).catch(console.error);
}