export default {
  contextSrc: ["server/src"],
  refactoringFiles: "server files affected by the diff change",
  taskPrompt: `
  
  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring. 
  
  Lets refactor it to support another llm engine, openai defaulting to chatgpt4 model. 
  
  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!
  `,

  responseFormat: "xml",
};
