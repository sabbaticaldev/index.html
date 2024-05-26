export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles: "all files related to the change",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Now I want your help reviewing all the components and the structure we have and help me create the building blocks components that are missing for a complete solution were we can create all blocks for apps and landing pages. 
  Now I want to review all components that have subcomponents and refactor them to use properties instead. So for example card would have a header, body and footer properties that could be an object/element or a string.  Same for accordion, tabs and other components that use unnecessary slots with subcomponents.`,
  responseFormat: "xml",
};
