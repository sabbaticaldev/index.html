export const processGroupInfo = (
  config,
  { ogData, groupData, getPersonaDetailsa } = {},
) => {
  const {
    postDescription,
    contentStyle,
    captionStyle,
    persona = "AllForTraveler",
  } = config;
  const personaDetails = getPersonaDetails(persona);
  const hashtags = config.hashtags ? "#list #of #hashtags" : "";
  const formatParams = {
    description: `if any content supplied is not in english, translate it  and give back results only in english. Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that shares traveling tips). use emoticons to make the reading easier. Be careful to not use wrong information like date, time, events, don't say things that create commitment to the AllforTraveller account. We are not part of the post, we are reposting other people adventures. Don't use the same idea of the current post, get another point of view. If there are hashtags, use them to create engaging and useful content related to it. Use max 300 chars (not counting hashtags).
        Format :
        --------
        Title
        City, Country [flag] (if applicable)
    
        description of the place with useful information for travelers
    
    
        credits: only if there is a mention
    
        ${hashtags}
        -------
        `,
    caption:
      "generate a short, catchy caption related to the content that can be displayed on the reel itself, max 6 words as the first line/title. If you mention a city or location name, add the country and the flag as emoticon to the caption. Give some useful tips about the place, weather, best time to visit, etc. Don't use marketing tone. ",
    hashtags: "maximum 5 hashtags",
    credits:
      "If there is a mention (@username) in the description, keep the mention to give credit to the rightful creator.",
    city: null,
    country: null,
  };
  const exampleParams = {
    description: `Discover the Breathtaking Hardergrat Trail\\n📍Hardergrat, Switzerland 🇨🇭🏔️\\n\\nAre you ready for an unforgettable adventure in the heart of the Swiss Alps? 🇨🇭\\n\\n 📸@adventureblog  \\n\\n ${hashtags}`,
    caption: "📍Hardergrat, Switzerland 🇨🇭",
    hashtags: "#Adventure #Hike #SwissAlps",
    credits: "@adventureblog",
    city: "Interlaken",
    country: "Switzerland",
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
            
        ${
          contentStyle
            ? `For the content style, use this as reference: ${contentStyle}`
            : ""
        }
        ${
          captionStyle
            ? `For the caption style, use this as reference: ${captionStyle}`
            : ""
        }
      `;
};
