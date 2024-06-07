export default {
  contextSrc: ["packages/aiflow/"],
  refactoringFiles: "aiflow files affected",
  taskPrompt: ` 
  We are working on aiflow, an AI-enabled CLI App Builder. We need to refactor it to be able to install it with npm install -g and run globally


`,

  responseFormat: "diff",
  strategy: "diff",
};
