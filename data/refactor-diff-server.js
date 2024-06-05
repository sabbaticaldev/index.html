export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: `  
   we created a server command line tool that intereact with our code base. We need now to create a new form of integration. It will have a github login/integration (through cli) and another task to create/connect to a project
   then we will have another task that will create TODO tasks
   then another task that will run those tasks and fix them with LLM using the refactor-diff logic
   the tasks should provide the same info that the refactor-diff offers: contextSrc, refactoringFiles and the taskPrompt  `,

  responseFormat: "diff",
  strategy: "diff",
};
