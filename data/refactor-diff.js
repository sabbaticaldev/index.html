export default {
  contextSrc: ["libs/frontend"],
  refactoringFiles: "reactive-view.js and other files affected by the change",
  taskPrompt: `
  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  
  this framework has a pattern similar to signals algorithm implementation but lacks the effect part. 
  `,

  responseFormat: "xml",
  strategy: "diff",
};
