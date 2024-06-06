export default {
  contextSrc: ["server/"],
  refactoringFiles: "files affected",
  taskPrompt: ` 
we just refactored todo-create.js task and related files to include a labels in the LLM response then we should save each task with their respective labels. every github project comes with some defined labels, we should use some of them and create one label of our own too that labels the macrotask
now we need to work on todo-run.js task which will need one more template

this is the workflow we will implement:
'pnpm task todo-run' task should find for the labels that start with "TODO-". this will be the label of the tasks we will get to work on
So we should prompt the user which of the open tasks (label) we want to work on
then we proceed to the next step of the operation, we fatch all open issues with the selected label
and iterate over it to start working on the tasks
to work on each task we will iterate over the tasks and run the refactor-diff function. we should always get the context again for each run because after the changes the context change so we need to update it 


`,

  responseFormat: "diff",
  strategy: "diff",
};
