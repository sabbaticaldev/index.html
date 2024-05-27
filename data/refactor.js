export default {
  contextSrc: ["server/src"],
  refactoringFiles: "files affected by this change",
  taskPrompt: `
  
  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring. I want to add another param to the current list (contextSrc, refactoringFiles, taskPrompt, responseFormat). The new param is strategy which can be file or diff which means the full file like currently or a diff with only the line changed (if the line is removed, it also only sign that line was removed in place of passing the whole line). Let's do this refactor.
  
  let's refactor and implement the diff strategy by the side of the file strategy as default

  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!
  `,

  responseFormat: "xml",
};
//We are creating a UI library based on Lit framework and tailwind/unocss. We created our own format to create those components as you can se in the apps/design files and uix/ files.
