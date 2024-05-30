export default {
  contextSrc: ["libs/frontend"],
  refactoringFiles: "uix/navigation components",
  taskPrompt: `
  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  
  We need to refactor the uix components to have a tag property with its tag (example: uix-hero, uix-header), add it to the object we are exporting.
  `,

  responseFormat: "xml",
  strategy: "diff",
};
