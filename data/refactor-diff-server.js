export default {
  contextSrc: ["server/"],
  refactoringFiles: "files affected",
  taskPrompt: ` 
lets refactor todo-create.js task and related files to include a labels in the LLM response then we should save each task with their respective labels. every github project comes with some defined labels, we should use some of them and create one label of our own too that labels the macrotask
  `,

  responseFormat: "diff",
  strategy: "diff",
};
