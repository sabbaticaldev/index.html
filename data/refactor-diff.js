//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/navigation and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
   we are refactoring the navigation components, lets improve them and refactor the usage in the sections/navigation/
  lets refactor and create a proper styled pagination.js stepper.js and tooltip.js components and their documentation in the sections 
  `,

  responseFormat: "diff",
  strategy: "diff",
};
