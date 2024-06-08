export default {
  contextSrc: ["packages/aiflow/"],
  refactoringFiles: "all files",
  taskPrompt: ` 
    We are working on aiflow, an AI-enabled CLI App Builder. 
    lets add JSDoc to the project files

`,

  responseFormat: "diff",
  strategy: "diff",
};
