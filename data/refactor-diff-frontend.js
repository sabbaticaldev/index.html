export default {
  contextSrc: ["libs/frontend", "app/apps/design/sections/form/"],
  refactoringFiles: "form components and section docs affected files",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
     we are refactoring the form components, lets improve them and refactor the usage in the sections/form/
    lets refactor the uix/form/range.js switch.js, radio.js  to improve them and have a modern look and feel based on tailwind and using the same coding style with data-theme and setting the theme object
    our range should work with one or 2 sliders, with two sliders to be a proper range. 
    
    `,

  responseFormat: "diff",
  strategy: "diff",
};
