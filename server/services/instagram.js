import fetch from "node-fetch";

import settings from "../settings.js";

function getPersonaDetails(persona) {
  const personas = {
    "AllForTraveler": {
      name: "AllForTraveler",
      tone: "Inspirational and informative",
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
    description: null,
    caption: null,
    hashtags: "maximum 5 hashtags",
    credits: null,
    city: null,
    country: null
  };
  const exampleParams = {
    description: "Discover the Breathtaking Hardergrat Trail 🏔️\\n\\nAre you ready for an unforgettable adventure in the heart of the Swiss Alps? 🇨🇭",
    caption: "📍Hardergrat, Switzerland 🇨🇭",
    hashtags: "#Adventure #Hike #SwissAlps",
    credits: "@adventureblog",
    city: "Interlaken",
    country: "Switzerland"
  };

  const format = generateFormat(formatParams);
  const example = generateExample(exampleParams);
  console.log({contentStyle});
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
  console.log({prompt});
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