export default {
  contextSrc: ["libs/frontend", "app/design"],
  refactoringFiles: "new markdown files",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
  Now we are creating the the design documentation in the app/design dir. We created the first form input.md, lets create the other forms components documentation

  We already created the markdown files. Now we need to create a package.js in each dir with an array with the elements as the default export. ["input", "range", ...]

  it will be used later to create the menu
    `,

  responseFormat: "diff",
  strategy: "diff",
};
