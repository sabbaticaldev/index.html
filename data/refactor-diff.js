export default {
  contextSrc: ["libs/frontend"],
  refactoringFiles: "uix/app, uix/chat, uix/content components refactored",
  taskPrompt: `
  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  
  We need to refactor the uix components to have a tag property with its tag (example: uix-hero, uix-header)
  
  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!
  `,

  responseFormat: "xml",
  strategy: "diff",
};
