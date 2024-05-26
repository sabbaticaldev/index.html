export default {
  contextSrc: ["libs/frontend", "libs/helpers"],
  refactoringFiles:
    "helpers/types.js and other files that are affected by this change",
  taskPrompt: `We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
we just refactored our code to have a type of Array that is bit more complex but our system doesnt support it yet:
+         export default {
  props: {
    allowMultiple: T.boolean(),
+    items: T.array({
+      defaultValue: [],
+      type: {
+        label: T.string(),
+        content: T.string(),
+        open: T.boolean(),
+      },
+    }),
  },
  render() {
    return html
    ........
  }
   so we need to refactor our code to support this. maybe we could also expand our type system to be more complete and support better typing, like the type could be a T.object({})  and we have a way to describe the T.object ? what do you suggest? (show me only the code)
  `,
  responseFormat: "xml",
};
