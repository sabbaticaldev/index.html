export default {
  contextSrc: ["libs/frontend", "app/design"],
  refactoringFiles: "new markdown files",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
  Now we are creating the the design documentation in the app/design dir. We created the first form input.md, lets create the other forms components documentation

  save them in app/design/form/

  dont repeat components that already have markdown file

  use app/design/form/input.md as reference. Make all .md as complete as input.md

  it should have the same elements. And twice the code example one as code and one as html that will be rendered
  
    `,

  responseFormat: "diff",
  strategy: "diff",
};
