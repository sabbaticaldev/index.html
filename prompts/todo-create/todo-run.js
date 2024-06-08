const data = {
  persona: "CodeRefactorer",
  prompt: ({ taskPrompt, exampleInputOutput, contextSrc, openIssues }) => {
    return `
Refactor the target refactoring files code using the context files as reference. Refactor code in blocks, not just lines for better diff patch applying. Dont change unnecessary things, only add to the response things that are useful to the applying of the diff patch.

Refactoring Prompt: ${taskPrompt}

Available open issues to choose from:
${JSON.stringify(openIssues, null, 2)}

Example Generated Output:
${exampleInputOutput}
Use the above format as output for the diff -- ENFORCE IT!

Context Files:
${contextSrc}
  `;
  },
  inputParams: {
    contextSrc: "JSON object containing paths and content of context files.",
    openIssues: "Array of open issues to choose from for refactoring.",
    taskPrompt: "Specific instructions on what should be done with the code.",
    strategy:
      "The merge strategy. It can be file for full file replace or diff for patch",
  },
  outputParams: {},
  exampleInput: {
    contextSrc: "src/",
    openIssues: [
      { title: "Refactor utils.js", description: "", number: 1 },
      { title: "Fix bug in models.js", description: "", number: 2 },
    ],
    taskPrompt:
      "Refactor issues related to utils.js using functional programming paradigms",
  },
  exampleOutput: {
    issuesAffected: [1],
  },
};

export default data;
