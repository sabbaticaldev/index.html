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
  ------
  if any content supplied is not in english, translateit  and give back results only in english.
  Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that shares traveling tips), 
  also adding a call to action at the end and then include a good amount of relevant hashtags, be picky and select some top traveling hashtags and a few mid-level. Max 10 hashtags. 
  We want to motivate people to go explore the world.  But be careful and don't make wrong assumptions, we aren't a tour guide officially, we just share motivational videos. 
  If there is a mention (@username) in the description, keep the mention to give credit to the rightful creator.
  Also, generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words as the first line/title. If you mention a city or location name, add the country and the flag as emoticon to the caption. 
  
  Should use the following format:
  {
    description,
    caption,
    hashtags,
    credits
  }
  
  description Format: - !!Dont forget to escape the \n inside of description!!
  Title\\n\\ndescription with interesting and useful content about the video/related to the description (like best time to visit, where to stay, famous parties or events in the area). Use some emojis too.\\n\\ncredits @user\\n\\n#list #of #hashtags
  
  Example:
  {
    "description": "A place that you must visit if you explore eastern Indonesia\n\n📍Bajawa, Nusa Tenggara Timur 🇮🇩",
    "caption": "📍Bajawa, Nusa Tenggara Timur, Indonesia 🇮🇩",
    "hashtags": "#Flores #NusaTenggaraTimur #PesonaIndonesia #WonderfulIndonesia #Dji #Beautifuldestinations #Djiglobal",
    "credits": "@Djiglobal"
  }
  
  

  
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
