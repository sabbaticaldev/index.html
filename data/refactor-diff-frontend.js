export default {
  contextSrc: ["app/design"],
  refactoringFiles: "new components.json",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
  Now we are creating the the design documentation in the app/design dir. We created the first form input.md, lets create the other forms components documentation
we just created a pakage.js in each section of the components for example app/design/form/package.js

but this doesnt work well for us. Lets creaet a components.json that will be an object in the formn:
{"form": ["package2", "package2", ...], "chat": ....}

`,

  responseFormat: "diff",
  strategy: "diff",
};
