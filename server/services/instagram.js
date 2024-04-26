import fetch from "node-fetch";

import settings from "../settings.js";
import { generateSocialMediaPostPrompt } from "./tasks/instagram.js";

export const generateSocialMediaPost = async (LLM, params) => {
  const prompt = generateSocialMediaPostPrompt(params);  
  try {
    const content = await LLM(prompt);
    return content;
  } catch (error) {
    console.error("Error generating social media post:", error);
    throw error;
  }
};

export async function fetchInstagramData(url) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
      "X-RapidAPI-Host": settings.RAPIDAPI_API
    }
  };
  const endpoint = "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php";
  const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(`Failed to fetch data from Instagram: ${response.statusText}`);

  return {
    video: data.video,
    image: data.image,
    description: data.caption
  };
}