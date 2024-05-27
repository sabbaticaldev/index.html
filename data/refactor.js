export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles:
    "all files related to adding missing components to libs/frontend/uix/navigation and libs/frontend/uix/layout",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Now I want your help reviewing all the components and the structure we have and help me create the building blocks components that are missing for a complete solution were we can create all blocks for apps and landing pages. 
  Let's create the component files for the components in app/apps/design/ documentation that aren't yet present in app libs/frontend/uix yet
  `,
  responseFormat: "xml",
};
