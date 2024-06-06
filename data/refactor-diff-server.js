export default {
  contextSrc: ["server/"],
  refactoringFiles: "files affected",
  taskPrompt: ` 
  This project is a collection of CLI tasks that I use from the command line. In the past refactor we introduced the usage of Inquirer.js. Lets refactor the codebase to use it in other places that it is a better option for better user interaction
  
we just refactored todo-create.js task and related files to include a labels in the LLM response then we should save each task with their respective labels. 
every github project comes with some defined labels, we should use some of them and create one label of our own too that labels the macrotask
now we need to work on todo-run.js task which will need one more template

this is the workflow we will implement:
'pnpm task todo-run' task should find for the labels that start with "TODO-". this will be the label of the tasks we will get to work on
So we should prompt the user which of the open tasks (label) we want to work on
then we proceed to the next step of the operation, we fatch all open issues with the selected label - lets stop in this task and later we continue


`,

  responseFormat: "diff",
  strategy: "diff",
};
