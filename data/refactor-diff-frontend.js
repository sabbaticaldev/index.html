export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
     we are refactoring the form components, lets improve them and refactor the usage in the sections/form/
    lets refactor the sections/form/range.js switch.js, radio.js and their sections/form documentation to expand the scenarios and implement the features. This is a final UI toolkit so lets implement some styling using tailwind and following the convention of the code
    our range should work with one or 2 sliders, with two sliders to be a proper range. 
    
    
    the components should receive a items property and iterate over it in place of creating a uix-sub-item component  `,

  responseFormat: "diff",
  strategy: "diff",
};