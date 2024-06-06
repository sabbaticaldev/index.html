export default {
  contextSrc: ["server/"],
  refactoringFiles: "files affected",
  taskPrompt: ` 
we just refactored todo-create.js task and related files to include a labels in the LLM response then we should save each task with their respective labels. every github project comes with some defined labels, we should use some of them and create one label of our own too that labels the macrotask
now we need to work on todo-run.js - we need to create its coding/github/run.js template and go over the other file changes like the tasks/github/todo-run.js

This is the start of work we need to finish (among other things):
{
  description: "Fetch Todo tasks",
  key: "todoTasks",
  operation: async () => {
    // Fetch open issues labeled as Todo from GitHub using gh CLI
    const openIssues = await fetchOpenIssues(labels).map((issue) => ({
      issueNumber: issue.number,
      title: issue.title,
      description: issue.body,
    }));

    const templateFile = "coding/github/run.js";
    const prompt = await generatePrompt(
      {
        contextSrc,
        taskPrompt,
        strategy: "diff",
        openIssues,
      },
      templateFile,
    );

    return await LLM.execute("bedrock", prompt, {
      responseFormat: "json",
      prefillMessage: "[",
    });
  },
},


we need to create the templateDile github/run.js, create the prompt, add the openIssues as the available issues the LLM can pick from based on the taskPrompt

we also need to create input and output examples (follow the pattern of other templates)
`,

  responseFormat: "diff",
  strategy: "diff",
};
