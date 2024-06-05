const data = {
  persona: "TaskManager",
  tone: "Professional and concise",
  prompt: ({ taskPrompt, contextSrc }) => `
    You are a project manager. Analyze the following codebase and generate a list of tasks that need to be completed. The tasks should focus on improving code quality, refactoring, fixing bugs, and enhancing features. Each task should include a title, description, and necessary context.
    Codebase Description:
    ${taskPrompt}

    The output should be a JSON array where each element is a task with the following structure:
    {
      "title": "Task title",
      "description": "Detailed description of the task",
      "contextSrc": {
        "filePath": "file content here"
      },
      "refactoringFiles": "files to be refactored",
      "taskPrompt": "specific task prompt"
    }

    ${contextSrc}
    
  `,
  inputParams: {
    codebaseDescription:
      "Description of the codebase to analyze and generate tasks for.",
  },
  outputParams: {
    tasks: "List of tasks in JSON format",
  },
  exampleInput: {
    codebaseDescription:
      "This is a project that includes various JavaScript files for a web server.",
  },
  exampleOutput: [
    {
      title: "Refactor utils.js",
      description: "Refactor utils.js to use functional programming paradigms.",
      contextSrc: {
        "src/utils.js": "file content here",
      },
      refactoringFiles: "src/utils.js",
      taskPrompt:
        "Refactor using functional paradigm, DRY and focus on efficiency with the minimum amount of code possible while keeping it readable",
    },
  ],
};

export default data;
