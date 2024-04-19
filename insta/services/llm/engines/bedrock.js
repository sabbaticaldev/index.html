import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockStrategy = config => async prompt => {
  const client = new BedrockRuntimeClient({
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
    region: config.region,
  });

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    system: "answer in a valid JSON format and in English, use a normal traveler tone not a marketing guy selling stuff",
    max_tokens: 2048,
    temperature: 0.5,
    top_k: 250,
    top_p: 1,
    stop_sequences: ["\\n\\nHuman:"],
  };
  const params = {
    modelId: config.BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  };

  try {
    const data = await client.send(new InvokeModelCommand(params));
    if (!data) {
      throw new Error("AWS Bedrock Runtime Error");
    }
    const response = JSON.parse(new TextDecoder("utf-8").decode(data.body));
    if (!response?.content[0].text) {
      throw new Error("Invalid response from LLM");
    }
    try {
      return JSON.parse(response.content[0].text);
    }
    catch(error) {
      console.log(response.content[0].text);
      console.log({error});
      return response.content[0].text;
    }
  } catch (error) {
    console.error("Error in bedrockStrategy:", error);
    throw error;
  }
};

export default bedrockStrategy;