//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/navigation and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
   we are refactoring the navigation components, lets improve them and refactor the usage in the sections/navigation/
lets refactor the sections/navigation/stepper.js to use the new uix-stepper api and lets create new example scenarios

lets also refactor sections/navigation/tooltip.js files to fix the scenarios to use uix-tooltip and create new scenarios
tooltip.js should allow also an icon that will be shown left of the content using a uix-list for them to be side by side with propery align="center"
  `,

  responseFormat: "diff",
  strategy: "diff",
};
