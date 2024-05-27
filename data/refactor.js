export default {
  contextSrc: ["libs/frontend", "app/apps/design"],
  refactoringFiles: "focus on files affected by the change",
  taskPrompt: `
  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.\n  lets refactor design/app.js and the new sections folders/files to reflect the components related to app and to page
  lots of sections already exists and just a few missing, focus on the missing ones like testimonial and others
  `,
  responseFormat: "xml",
};
