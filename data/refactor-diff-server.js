export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: `  
   lets refactor the instagram.js code, create a import folder and separate it into one file for each function
   and then remove instagram.js

   be careful with the changes, only work on the requested things, dont change other things in the code
   `,

  responseFormat: "diff",
  strategy: "diff",
};
