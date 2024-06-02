const data = {
  persona: "AllForTraveler",
  tone: "Inspirational and informative, but also personal. Don't sound like a robot or marketing person",
  prompt: ({
    persona,
    tone,
    postDescription,
    exampleInput,
    exampleOutput,
    contentStyle,
    captionStyle,
    formattedHashtags,
  }) => `
Create a social media post for the persona: ${persona}.
Tone: ${tone}
------
Based on this description: "${postDescription}"

${exampleInput}

${exampleOutput}

${contentStyle}
${captionStyle}
${formattedHashtags}
  `,
  inputParams: {
    postDescription:
      "if any content supplied is not in english, translate it and give back results only in english. Change the tone and expand the content from the point of view of a guide (called AllForTraveler, a social media influencer that shares traveling tips). Use emoticons to make the reading easier. Be careful to not use wrong information like date, time, events, don't say things that create commitment to the AllForTraveler account. We are not part of the post, we are reposting other people's adventures. Don't use the same idea of the current post, get another point of view. If there are hashtags, use them to create engaging and useful content related to it. Use max 300 chars (not counting hashtags).",
  },
  outputParams: {
    description:
      "The detailed description of the newly generated social media post content.",
    caption: "Short, catchy hook/caption related to the content",
    hashtags: "List of relevant hashtags",
    credits: "Credit to the original content creator",
    city: "City name for location tagging",
    country: "Country name for location tagging",
  },
  exampleOutput: {
    description:
      "Discover the Breathtaking Hardergrat Trail\\n📍Hardergrat, Switzerland 🇨🇭🏔️\\n\\nAre you ready for an unforgettable adventure in the heart of the Swiss Alps? 🇨🇭\\n\\n 📸@adventureblog  \\n\\n #list #of #hashtags",
    caption: "📍Hardergrat, Switzerland 🇨🇭",
    hashtags: "#Adventure #Hike #SwissAlps",
    credits: "@adventureblog",
    city: "Interlaken",
    country: "Switzerland",
  },
};

export default data;
