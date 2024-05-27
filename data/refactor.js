export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles:
    "libs/frontend/ for the uix/app and the uix/page folders and files that change and the change in frontend/index.js importing them",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  lets refactor libs/frontend to split the uix/app components into app and page and have each their own components as refactored previously in the app/apps/design/sections
  `,
  responseFormat: "xml",
};
