const data = {
  persona: "TaskManager",
  tone: "Professional and concise",
  prompt: ({ taskPrompt, contextSrc, exampleInputOutput, labels }) => `
    You are a project manager. Analyze the following codebase and generate a list of tasks that need to be completed. The tasks should focus on improving code quality, refactoring, fixing bugs, and enhancing features. Each task should include a title, description, and necessary context. 
    CONSTRAINTS:
    - only create tasks that a LLM can work with (generating code, tests, content, etc)

    Task:
    ${taskPrompt}

    Example Input and Generated Output:
    ${exampleInputOutput}

    available labels to choose from: ${labels} 
    If the main label for this component doesn't exist you can also add it to create 

    The output should be a JSON array where each element is a task with the following structure:
    {
      "title": "Task title",
      "description": "Detailed description of the task",
      labels: ["TODO", "documentation", "component"]
    }

    ${
      contextSrc
        ? `
    Context Source:
    ${contextSrc}
    `
        : ""
    }
    

  `,
  inputParams: {
    taskPrompt:
      "Description of the codebase to analyze and generate tasks for.",
    contextSrc: "Source code to use as reference to generate tasks",
    labels: "array with available labels",
  },
  outputParams: "JSON array with the task entries",
  exampleInput: {
    taskPrompt:
      "This is a project that includes various JavaScript files for a web server.",
    contextSrc: "src/",
    labels: ["TODO", "documentation", "test"],
  },
  exampleOutput: [
    {
      title: "Refactor utils.js",
      description: "Refactor utils.js to use functional programming paradigms.",
      labels: ["TODO", "utils"],
    },
  ],
};

export default data;
