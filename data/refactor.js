export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles:
    "all files related to the change of flattening subcomponents in app/apps/design",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Now I want your help reviewing all the components and the structure we have and help me create the building blocks components that are missing for a complete solution were we can create all blocks for apps and landing pages. 
  We just refactored all components that had subcomponents and flattened them, now we need to refactor the docs to reflect the new format for tabs, card and accordion. So for example card would have a header, body and footer properties that could be an object/element or a string.  Same for accordion, tabs and other components that use unnecessary slots with subcomponents.`,
  responseFormat: "xml",
};
