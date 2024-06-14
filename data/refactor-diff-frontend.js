export default {
  contextSrc: ["app/design", "libs/frontend"],
  refactoringFiles: "accordion.js, navbar.js new navbar-item.js, layout/package.js and others",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
 
   we just refactored the libs/frontend/uix/layout/accordion.js
  we created accordion-item.js

  now we want to do the same for navbar. we want to create navbar-item and navbar will have a icon, label and can be accordion true or false, the navbar-item can have a href or onclick, icon, label and it could also receive another navbar as the slot 
  
`,

  responseFormat: "diff",
  strategy: "diff",
};
