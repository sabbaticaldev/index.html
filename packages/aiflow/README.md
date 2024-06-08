# aiflow

aiflow is a workflow and LLM integration package that simplifies the process of integrating large language models (LLMs) into your projects and workflows.

## Installation

To install aiflow, use npm:

```bash
npm install aiflow
```

## Usage

Here's a basic example of how to use aiflow in your project:

```javascript
import { LLM, prompt } from 'aiflow';

const prompt = prompt({
  taskPrompt: 'Translate the following text to French:',
  inputText: 'Hello, how are you?'
}, 'translation-template.js');

const translatedText = await LLM.execute('openai', prompt);
console.log(translatedText);
```

## Utilities

aiflow provides several utility functions to help with common tasks:

- `prompt`: Generates a prompt based on a template and input parameters.
- `cleanLLMResponse`: Cleans and formats the response from an LLM.
- `parseXML`: Parses an XML string into a JavaScript object.
- `generateXMLFormat`: Generates an XML string from a JavaScript object.

## Engines

aiflow supports the following LLM engines:

- OpenAI: Integrate with OpenAI's GPT models.
- Bedrock: Integrate with Anthropic's Bedrock models.

## Configuration

To configure aiflow, you need to provide the necessary API keys and settings for the LLM engines you plan to use. Here's an example configuration:

```javascript
import { LLM } from 'aiflow';

const openaiConfig = {
  apiKey: 'your-openai-api-key'
};

const bedrockConfig = {
  modelId: 'your-bedrock-model-id',
  apiKey: 'your-bedrock-api-key',
  apiSecret: 'your-bedrock-api-secret'
};

LLM.configure({
  openai: openaiConfig,
  bedrock: bedrockConfig
});
```

## Examples

Here are a few examples of how you can use aiflow for common LLM and workflow tasks:

### Text Summarization

```javascript
import { LLM, prompt } from 'aiflow';

const prompt = prompt({
  taskPrompt: 'Summarize the following text:',
  inputText: 'A long article...'
}, 'summarization-template.js');

const summary = await LLM.execute('openai', prompt);
console.log(summary);
```

### Code Generation

```javascript
import { LLM, prompt } from 'aiflow';

const prompt = prompt({
  taskPrompt: 'Generate a Python function to calculate the factorial of a number:',
}, 'code-generation-template.js');

const generatedCode = await LLM.execute('bedrock', prompt);
console.log(generatedCode);
```

For more examples and detailed usage instructions, please refer to the aiflow documentation.