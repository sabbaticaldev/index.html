//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/layout/", "libs/frontend/"],
  refactoringFiles:
    "layout/modal.js and libs/frontend/uix/layout/modal.js and icon.js",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
    we are now refactoring the uix-modal component

    lets create multiple new sscenarios in the sections/layout/modal.js and create those functionsties in the uix/layout/modal.js that matches those features.
    We want:
    a configurable close button in the right top that shows by default
    a configurable dropdown that could be in the same place as the close button with those 3 vertical dots (we are using lucide fonts) 
    a label and a icon that shows in the top left if available
    a main content
    a footer
    it should also have a width and height prop that accept string like lg, md, full, etc
      we should create examples using uix-form, uix-buttons, content in the sections/layout/modal.js

  `,

  responseFormat: "diff",
  strategy: "diff",
};
