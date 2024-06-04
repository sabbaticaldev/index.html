//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/", "libs/frontend/uix/content/"],
  refactoringFiles: "uix/content/icon.js file",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
    we added a icon property to all sections and packages, now we want to add all icons to the uix-icon component

    import { html, T } from "helpers";
    const iconNames = [
      "chevron-up",
      "chevron-down",
      "navigation",
      "monitor",
      "star",
      "users",
      "user",
      "tag",
      "home",
      "heart",
      "spinner",
      "smartphone",
      "layout",
      "git-branch",
      "type",
      "clock",
      "git-commit",
      "git-merge",
      "alert-triangle",
      "loader",
      "bell",
      "message-circle",
      "bar-chart",
      "mouse-pointer",
      "edit",
    ];
    
    export default {
      tag: "uix-icon",
      props: {
        iconSet: T.string({ defaultValue: "lucide" }),
        name: T.string(),
        size: T.string({ defaultValue: "" }),
      },
      theme: {
        "uix-icon": {
          _base: ({ name, iconSet }) => \`i-\${iconSet}-\${name} block\`,
        },
        "uix-icon__icons": iconNames.map((name) => "i-lucide-" + name).join(" "),
      },
      render() {
        return html\`\`;
      },
    };
    
    as you can see we have a big list of icons but still many of the icons in the package.js and sections components are not in the list, please gather all missing and update
    
  `,

  responseFormat: "diff",
  strategy: "diff",
};

/* IGNORE THIS COMMENT BLOCK:
Always use best practices when coding.
Respect and use existing conventions, libraries, etc that are already present in the code base.

Take requests for changes to the supplied code.
If the request is ambiguous, ask questions.

  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.

  we have a boilerplate code of a spacer element for the UI kit but no implementation, go ahead and implement it for us

  ========================

  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring.

  to apply the changes from the LLM we implemented a git diff logic. Let's refactor it to just use simple unified diff for it

  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!

  */
