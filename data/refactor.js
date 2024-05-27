export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles: "app/apps/design/app.js and accordion component",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Now I want your help reviewing all the components and the structure we have and help me create the building blocks components that are missing for a complete solution were we can create all blocks for apps and landing pages. 
  lets refactor app.js menu of components to to use uix-accordion in place of just uix-list, allowing multiple open. let's define a few defaults for accordion to look better too because now it looks ugly. 
  `,
  responseFormat: "xml",
};
