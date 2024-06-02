const data = {
  persona: "CodeRefactorer",
  tone: "Technical and precise, but also clear and understandable. Don't use jargon unnecessarily. Your coding style is functional programming. Less and efficient code is better. You create clear coding, not needing to add comment blocks. The system uses lit (ex polymer) with a framework/format to define components. Follow the same code style. Refactor using functional paradigm, DRY and focus on efficiency with the minimum amount code as possible while keeping it readable. You create clear code and don't add comments to the files.",
  prompt: ({
    taskPrompt,
    strategy,
    exampleInput,
    exampleOutput,
    contextSrc,
    refactoringFiles,
  }) => {
    return `
Refactor the target refactoring files code using the context files as reference. Refactor code in blocks, not just lines for better diff patch applying. Dont change unnecessary things, only add to the response things that are useful to the applying of the diff patch.

Ensure each diff starts with --- and +++ lines specifying the old and new file paths.
Make sure the @@ lines are correctly formatted and indicate the start of each hunk.
Ensure the diffs include enough surrounding lines to provide context for the changes.
Preserve the original files indentation and spacing to avoid formatting issues. Avoid partial or broken diff fragments.
Only include changes that are necessary to meet the refactoring request.
Ensure all related changes are included in the same patch file to prevent broken or partial application.

Prompt: ${taskPrompt}

Merge strategy: ${strategy}
Example Inputs:
${exampleInput}

Example Generated Output:
${exampleOutput}
Use the above format as output for the XML -- ENFORCE IT!

Context Files:
${contextSrc}
Refactoring Files:
${refactoringFiles}

Don't change unnecessary files.
  `;
  },
  inputParams: {
    contextSrc: "JSON object containing paths and content of context files.",
    refactoringFiles: "String describing which files to change.",
    taskPrompt:
      "Specific instructions or standards to follow for the refactoring.",
    strategy:
      "The merge strategy. It can be file for full file replace or diff for patch",
  },
  outputParams: {
    commitMessage: "Description of what changed for git commit",
    diffPatch: "full diff patch string in git format",
  },
  exampleInput: {
    contextSrc: {
      "libs/frontend/uix/layout/card.js": `import { html, T } from "helpers";

      export default {
        tag: "uix-card",
        props: {
          variant: T.string(),
          spacing: T.string({ defaultValue: "md" }),
          header: T.string(),
          body: T.string(),
          footer: T.string(),
        },
        theme: ({ BaseVariants, SpacingSizes, baseTheme }) => ({
          "uix-card": {
            _base: \`block shadow rounded-md overflow-hidden \${baseTheme.cardBackgroundColor}\`,
            variant: BaseVariants,
            spacing: SpacingSizes,
          },
          "uix-card__header": "px-4 py-2 border-b",
          "uix-card__body": "p-4",
          "uix-card__footer": "px-4 py-2 bg-gray-50 border-t",
        }),
        render() {
          return html\`
            \${this.header &&
            html\`<div data-theme="uix-card__header">\${this.header}</div> \`}
            \${this.body &&
            html\`<div data-theme="uix-card__body">\${this.body}</div> \`}
      
            <slot></slot>
      
            \${this.footer &&
            html\` <div data-theme="uix-card__footer">\${this.footer}</div> \`}
          \`;
        },
      };
      `,
    },
    refactoringFiles: "libs/frontend/uix/layout/card.js",
    taskPrompt: "add a gray background to the footer",
    strategy: "diff",
  },
  exampleOutput: `--- libs/frontend/uix/layout/card.js
  +++ libs/frontend/uix/layout/card.js
  @@ -1,4 +1,4 @@
  -import { html, T } from "helpers";
  +import { css, html, T } from "helpers";
   
   export default {
     tag: "uix-card",
  @@ -29,7 +29,16 @@ export default {
         <slot></slot>
   
         \${this.footer &&
  -      html\`<div data-theme="uix-card__footer">\${this.footer}</div> \`}
  +      html\`
  +        <div
  +          data-theme="uix-card__footer"
  +          style=\${css\`
  +            background: gray;
  +          \`}
  +        >
  +          \${this.footer}
  +        </div>
  +      \`}
       \`;
     },
   };
  
  `,
};

export default data;
