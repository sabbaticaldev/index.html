//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/navigation and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
   we are refactoring the navigation components, lets improve them and refactor the usage in the sections/navigation/
  lets refactor the sections/navigation/wizard.js  and the uix/navigation/wizard.js and create more scenarios that we need tabs and different tabs in the section then refactor the tabs component to match it and look good using tailwind
  `,

  responseFormat: "diff",
  strategy: "diff",
};
