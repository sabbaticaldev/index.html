export default {
  contextSrc: ["server/"],
  refactoringFiles: " task affected files",
  taskPrompt: ` 

  this is the work to do:
  - lets refactor the tasks/instagram.js code, create a import folder and separate it into one file for each of their operations and then remove tasks/instagram.js
  - we should also update the files that uses those functions
  - be careful with the changes, only work on the requested things, dont change other things in the code
  `,

  responseFormat: "diff",
  strategy: "diff",
};
