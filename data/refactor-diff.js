//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/navigation and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
   we are refactoring the navigation components, lets improve them and refactor the usage in the sections/navigation/
   starting by the breadcrumb
   let's add a icon and active option for the item and new scenarios in the sections/navigtion/breadcrumb.js like with active,without active, with uix-icon
  `,

  responseFormat: "diff",
  strategy: "diff",
};
