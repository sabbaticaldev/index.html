export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles:
    "app/apps/design/sections/app files, app/apps/design/sections/page files and app/apps/design/app.js",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  lets refactor design/app.js and the new sections folders/files to reflect the components related to app and to page
  `,
  responseFormat: "xml",
};
