export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles: "the refactored app/apps/design/app.js",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  Lets refactor the sections to reflect the current uix/ and sections/ described components
  `,
  responseFormat: "xml",
};
