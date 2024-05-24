import settings from "../../settings.js";
import bedrock from "./engines/bedrock.js";

export default (provider) => {
  switch (provider) {
  case "bedrock":
    return bedrock(settings);
  default:
    throw new Error("Unsupported LLM provider");
  }
};
