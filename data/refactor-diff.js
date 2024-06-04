//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/navigation and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
   we are refactoring the navigation components, lets improve them and refactor the usage in the sections/navigation/
  lets refactor the stepper component to have a count (starting with 1) for the steps and optionally in place of the count it would be an icon supplied for each item
  the stepper can also be vertical (like the uix-list, so let's use a uix-list) 
  we can have a editable step and non editable steps. Editable steps are when the item has a link and it can be clicked when the step is before the current step
  `,

  responseFormat: "diff",
  strategy: "diff",
};
