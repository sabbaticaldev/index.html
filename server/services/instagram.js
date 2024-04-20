import fetch from "node-fetch";

import settings from "../settings.js";

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

export const generateSocialMediaPost = async (LLM, description) => {
  const prompt = `Create a social media post using the following description: "${description}". 
  Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that shares traveling tips), 
  also adding a call to action at the end and then include a good amount of relevant hashtags, be picky and select some top traveling hashtags and a few mid-level. Max 10 hashtags. 
  We want to motivate people to go explore the world.  But be careful and don't make wrong assumptions, we aren't a tour guide officially, we just share motivational videos. 
  If there is a mention (@username) in the description, keep the mention to give credit to the rightful creator.
  Also, generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words as the first line/title. If you mention a city or location name, add the country and the flag as emoticon to the caption. 
  
  `;
  
  try {
    const content = await LLM(prompt);
    console.log({prompt, content});
    console.log("Generated content:", content);
    return content;
  } catch (error) {
    console.error("Error generating social media post:", error);
    throw error;
  }
};
