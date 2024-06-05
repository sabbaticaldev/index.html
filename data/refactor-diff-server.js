export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: `  
   lets refactor the server logic mainly the patch applying to remove the file when we see a 
   
 
   --- file/path.js
   +++ /dev/null


   after we can ignore the the content
   `,

  responseFormat: "diff",
  strategy: "diff",
};
