export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles:
    "the refactored app/apps/design/app.js, the added package.js files for each section",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  let's refactor design/app.js to reduce the amount of imports. Let's create a package.js for each section and include there the imports and then in design/app.js import the sections. Update app.js logic to accept this new format of receiving the sections/components
  `,
  responseFormat: "xml",
};
