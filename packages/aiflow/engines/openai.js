import OpenAIApi from "openai";

const openaiStrategy =
  (config) =>
  async (prompt, options = {}) => {
    const {
      model = "gpt-4",
      temperature = 0.2,
      maxTokens = 2048,
      stopSequences = ["\n\nHuman:"],
    } = options;

    const openai = new OpenAIApi({ apiKey: config.OPENAI_API_KEY });

    const body = {
      model,
      prompt: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
      stop: stopSequences,
    };

    try {
      const response = await openai.createChatCompletion(body);
      if (!response) {
        throw new Error("OpenAI API Error");
      }
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error in openaiStrategy:", { error });
      throw error;
    }
  };

export default openaiStrategy;
