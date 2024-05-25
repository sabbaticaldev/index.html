import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockStrategy =
  (config) =>
    async (prompt, options = {}) => {
      const {
        modelId = config.BEDROCK_MODEL_ID,
        contentType = "application/json",
        responseFormat = "json",
        accept = "application/json",
        anthropicVersion = "bedrock-2023-05-31",
        maxTokens = 4096,
        temperature = 0.5,
        topK = 250,
        topP = 1,
        stopSequences = ["\\n\\nHuman:"],
        systemMessage = "answer in a valid JSON format and in English. if any content supplied is not in english, translate it and give back results only in english.",
      } = options;

      const client = new BedrockRuntimeClient({
        credentials: {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        },
        region: config.region,
      });

      let prefillMessage = "";
      if (responseFormat === "xml") {
        prefillMessage =
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
      } else if (responseFormat === "json") {
        prefillMessage = "{";
      }

      const body = {
        anthropic_version: anthropicVersion,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }],
          },
          {
            role: "assistant",
            content: [{ type: "text", text: prefillMessage }],
          },
        ],
        system: systemMessage,
        max_tokens: maxTokens,
        temperature,
        top_k: topK,
        top_p: topP,
        stop_sequences: stopSequences,
      };
      const params = {
        modelId,
        contentType,
        accept,
        body: JSON.stringify(body),
      };
      console.log(JSON.stringify(params));
      let data;
      try {
        data = await client.send(new InvokeModelCommand(params));
        if (!data) {
          throw new Error("AWS Bedrock Runtime Error");
        }
        const decodedBody = new TextDecoder("utf-8").decode(data.body);
        const response = JSON.parse(decodedBody);
        if (!response?.content[0].text) {
          throw new Error("Invalid response from LLM");
        }
        return response.content[0].text;
      } catch (error) {
        console.error("Error in bedrockStrategy:", { error });
        throw error;
      }
    };

export default bedrockStrategy;
