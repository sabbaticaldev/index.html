import fetch from "node-fetch";

import { settings } from "../settings.js";

export async function fetchInstagramData(url) {
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
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": settings.RAPIDAPI_API
      }
    };
    const endpoint = "https://instagram-media-downloader.p.rapidapi.com/rapid/post.php";
    const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(`Failed to fetch data from Instagram: ${response.statusText}`);
  }
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
  Also, generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words as the first line/title.
  
  I want to receive an object with the following format:
  {
    description,
    caption,
    hashtags,
    credits
  }
  
  Description Format (use \r\n for breakline):
  caption (use emojis in the caption)

  description with interesting and useful content about the video/related to the description (like best time to visit, where to stay, famous parties or events in the area). Use some emojis too. 
  credits @user

  #list #of #hashtags
  
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
