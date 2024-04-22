import fetch from "node-fetch";

import settings from "../settings.js";

function getPersonaDetails(persona) {
  const personas = {
    "AllForTraveler": {
      name: "AllForTraveler",
      tone: "Inspirational and informative, but also personal. Don't sound like a robot or marketing person",
      description: "A social media influencer sharing travel tips."
    }
  };
  return personas[persona] || personas["AllForTraveler"]; 
}

function generateFormat(params) {
  const formatEntries = Object.keys(params).map(key => {
    return params[key] === null ? `"${key}",` : `"${key}", // ${params[key]}`;
  });

  return `
  Expected format:
  
  {
    ${formatEntries.join("\n    ")}
  }`;
}

function generateExample(params) {
  const exampleEntries = Object.entries(params).map(([key, value]) => {
    return `"${key}": "${value}"`;
  });

  return `
  
  Example:
  {
    ${exampleEntries.join(",\n    ")}
  }`;
}


export const generateSocialMediaPostPrompt = ({ postDescription, contentStyle, captionStyle, persona = "AllForTraveler" }) => {
  const personaDetails = getPersonaDetails(persona);
  const formatParams = {
    description: `if any content supplied is not in english, translateit  and give back results only in english. Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that shares traveling tips). use emoticons to make the reading easier. Be careful to not use wrong information like date, time, events, don't say things that create commitment to the AllforTraveller account. We are not part of the post, we are reposting other people adventures.
    Format :
    --------
    Title
    City, Country [flag] (if applicable)

    description of the place with useful information for travelers


    credits

    #list #of #hashtags
    -------
    `,
    caption: "generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words as the first line/title. If you mention a city or location name, add the country and the flag as emoticon to the caption.",
    hashtags: "maximum 5 hashtags",
    credits: "If there is a mention (@username) in the description, keep the mention to give credit to the rightful creator.",
    city: null,
    country: null
  };
  const exampleParams = {
    description: "Discover the Breathtaking Hardergrat Trail\\n📍Hardergrat, Switzerland 🇨🇭🏔️\\n\\nAre you ready for an unforgettable adventure in the heart of the Swiss Alps? 🇨🇭\\n\\n 📸@adventureblog  \\n\\n #travel #Adventure #Hike #SwissAlps",
    caption: "📍Hardergrat, Switzerland 🇨🇭",
    hashtags: "#Adventure #Hike #SwissAlps",
    credits: "@adventureblog",
    city: "Interlaken",
    country: "Switzerland"
  };

  const format = generateFormat(formatParams);
  const example = generateExample(exampleParams);  
  return `
    Create a social media post for the persona: ${personaDetails.name}.
    Tone: ${personaDetails.tone}
    ------
    Based on this description: "${postDescription}"

    ${format}
    
    ${example}
        
    ${contentStyle ? `For the content style, use this as reference: ${contentStyle}` : ""}
    ${captionStyle ? `For the caption style, use this as reference: ${captionStyle}` : ""}
  `;
};

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