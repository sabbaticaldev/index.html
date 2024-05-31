//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["libs/frontend"],
  refactoringFiles: "frontend files affected by the change",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
    lets refactor to remove uix-container use if any

  `,

  responseFormat: "xml",
  strategy: "diff",
};

/* IGNORE THIS COMMENT BLOCK:
Always use best practices when coding.
Respect and use existing conventions, libraries, etc that are already present in the code base.

Take requests for changes to the supplied code.
If the request is ambiguous, ask questions.

  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.

  we have a boilerplate code of a spacer element for the UI kit but no implementation, go ahead and implement it for us

  ========================

  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring.

  to apply the changes from the LLM we implemented a git diff logic. Let's refactor it to just use simple unified diff for it

  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!

  */
