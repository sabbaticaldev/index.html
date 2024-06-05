export default {
  contextSrc: ["server/"],
  refactoringFiles: "server/tasks/ affected files related to maps",
  taskPrompt: ` 

  this is the work to do:
  - lets refactor the tasks/maps.js code, create a import folder and separate it into one file for each of their operations and then remove tasks/maps.js
  - we should also update the files that uses those functions
  - be careful with the changes, only work on the requested things, dont change other things in the code


  when updating server/tasks/index.js be careful to only add the correct imports and remove the ones not used
  `,

  responseFormat: "diff",
  strategy: "diff",
};
