export default {
  contextSrc: ["app/design", "libs/frontend"],
  refactoringFiles: "accordion.js, navbar.js new accordion-item.js, layout/package.js and others",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
 
   we are refactoring the libs/frontend/uix/layout/accordion.js
   you can see it in use at the navbar.js we use the accordion it should also be refactored
   what we want to do is to change accordion in place of receiving an items array, it will have a <slot/> and we will pass to it uix-accordion-items for each item so we need to refactor it all for this to work
`,

  responseFormat: "diff",
  strategy: "diff",
};
