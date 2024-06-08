export default {
  contextSrc: ["packages/aiflow/"],
  refactoringFiles: "all files affected",
  taskPrompt: ` 
  We created a utils/files.js with but that are some places that are still using fs or path directly like in utils/tasks.js. lets refactor all places to use a wrapper on top of nodejs features. if some of them doesnt exist yet, create as a util. 

`,

  responseFormat: "diff",
  strategy: "diff",
};
