export default {
  contextSrc: ["app/apps/design/sections/"],
  refactoringFiles: " sections affected files",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
  we are refactoring the design system documentation. We are refactoring the components properties to become an object with label: html in place of an array of components. Many were already migrated but a few are not yet, migrate the ones missing.

  FOCUS ON THE SECTIONS THAT ARE STILL USING ARRAYS in components, not the ones that were already refactored

    lets refactor this. Example:

    import { html } from "helpers";
// inputSection.js
export default {
  icon: "type",
  label: "Inputs",
  components: [
    {
      label: "Default Input",
      render: () => html\`<uix-input placeholder="Default Input"></uix-input>\`,
    },
    {
      label: "Password Input",
      render: () => html\`<uix-input placeholder="Password Input"></uix-input>\`,
    },
    {
      label: "Email Input",
      render: () => html\`<uix-input placeholder="Email Input"></uix-input>\`,
    },
  ],
};


becomes:

import { html } from "helpers";
export default {
  icon: "type",
  label: "Inputs",
  components: {
      "Default Input": html\`<uix-input placeholder="Default Input"></uix-input>\`,
      "Password Input": html\`<uix-input placeholder="Password Input"></uix-input>\`,
      "Email Input":  html\`<uix-input placeholder="Email Input"></uix-input>\`,
    },
  ],
};


    `,

  responseFormat: "diff",
  strategy: "diff",
};
