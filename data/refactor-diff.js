export default {
  contextSrc: ["server/src"],
  refactoringFiles:
    "diff patch for server/src/utils.js, tasks/index.js and other affecting files",
  taskPrompt: `
  
  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring. I want to add another param to the current list (contextSrc, refactoringFiles, taskPrompt, responseFormat). The new param is strategy which can be file or diff which means the full file like currently or a diff with only the line changed (if the line is removed, it also only sign that line was removed in place of passing the whole line). Let's do this refactor.
  
  lets refactor tasks/index.js and utils.js to work well with the diff strategy
  
  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!
  `,

  responseFormat: "xml",
  strategy: "diff",
};
