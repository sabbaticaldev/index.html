const data = {
  persona: "TaskManager",
  prompt: ({ taskPrompt, contextSrc, exampleInputOutput, labels }) => `
    You are a project manager. Analyze the following codebase and generate a list of tasks that need to be completed. The tasks should focus on improving code quality, refactoring, fixing bugs, and enhancing features. Each task should include a title, description, and necessary context. 
    
    Task:
    ${taskPrompt}

    Example Input and Generated Output:
    ${exampleInputOutput}

    Available labels to choose from: ${labels} 
    
    Create one unique label that all the created tasks will have. It should start with TODO- so we can later filter available tasks. Example: TODO-TodoMVC-bootstrap

    The output should be a JSON array where each element is a task with the following structure:
    {
      "title": "Task title",
      "description": "Detailed description of the task including step-by-step instructions and files affected",
      "labels": ["documentation", "component"]
    }

    CONSTRAINTS:
    - only create tasks that a LLM can work with (generating code, tests, content, etc)
    - All tasks shoud take into account the information about each other, mention same file path, use same libraries, code convention, etc
    - !IMPORTANT! The first added task should be an overall specification of the change including all changed files (treeview) and an overall explanation and step-by-step guide for the change with progressive changes until the final goal
    - If it is a new project, create a valid package.json with the appropriate tasks to run the project
    - Use JavaScript, EcmaScript with the most modern features. Same for nodejs
    - Add test files side by side of the file it will be testing
    - use "src/components/button-component/button-component.js" convention
    - Start 
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
      "Lets refactor utils.js to use a functional paradigm, create new component and remove old component",
    contextSrc: "src/",
    labels: ["refactor", "documentation", "test", "code"],
  },
  exampleOutput: [
    {
      title: "Refactor utils.js",
      description: `Refactor utils.js to use functional programming paradigms.
      Step-by-step instructions:
      1. Identify imperative code patterns in utils.js.
      2. Refactor the identified code to use functional programming techniques such as pure functions, higher-order functions, and immutability.
      3. Ensure all existing unit tests pass after refactoring.
      4. Add new unit tests if necessary to cover edge cases.
      Files affected:
      - src/utils.js`,
      labels: [
        "TODO-refactor-functional-newComponent-remove-old-component",
        "refactor",
      ],
    },
    {
      title: "Create new component",
      description: `Create a new component with a simple render function.
      Step-by-step instructions:
      1. Create a new file named newComponent.js in the layout directory.
      2. Implement the component using Lit.
      3. Ensure the component has a basic render function that returns a simple HTML structure.
      4. Add any necessary props and default values.
      Files affected:
      - src/layout/newComponent.js`,
      labels: [
        "TODO-refactor-functional-newComponent-remove-old-component",
        "code",
      ],
    },
    {
      title: "Remove old component",
      description: `Remove the old component file.
      Step-by-step instructions:
      1. Identify the old component file (oldComponent.js) in the layout directory.
      2. Ensure there are no dependencies on this component elsewhere in the codebase.
      3. Remove the file from the project.
      4. Update any references or documentation to reflect the removal.
      Files affected:
      - src/layout/oldComponent.js
      - all files that references oldComponent`,
      labels: [
        "TODO-refactor-functional-newComponent-remove-old-component",
        "code",
      ],
    },
  ],
};

export default data;
