export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles: "the refactored app/apps/design/sections/content",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Now I want your help reviewing all the components and the structure we have and help me create the building blocks components that are missing for a complete solution were we can create all blocks for apps and landing pages. 
  Lets update our documentation to reflect the components we have. Let's extend them to have more variations. 
  
  `,
  responseFormat: "xml",
};
