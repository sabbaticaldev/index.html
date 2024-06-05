export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: `  
   we created a server command line tool that intereact with our code base. We need now to create a new form of integration. It will have a github login/integration (through cli) and another task to create/connect to a project
   then we will have another task that will create TODO tasks
   then another task that will run those tasks and fix them with LLM using the refactor-diff logic
   the tasks should provide the same info that the refactor-diff offers: contextSrc, refactoringFiles and the taskPrompt  
   lets use the gh commandline tool and exec the commands
   we should be authenticated using our ssh key

   we already started the work so lets continue from it

   Our end goal is to create an automate pipeline where you (a LLM) can read the code, create tasks and work on those tasks refactoring the code, commiting the change, commenting and moving the ticket to QA

   we should work now on the tasks/todo.js to create the workflows to support our project using the github.js api
   `,

  responseFormat: "diff",
  strategy: "diff",
};
