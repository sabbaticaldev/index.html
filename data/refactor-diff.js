//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["app/apps/design/sections/navigation/", "libs/frontend/"],
  refactoringFiles: "sections/layout/ and affected files",
  taskPrompt: `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.    
    we are now refactoring the uix-modal component
lets create the uix-dropdown component, updates its section in the navgation/dropdown.js and also update its usage in the uix/navigation/modal.js component

reference:

dropdown: T.string(),


if (this.dropdown) {
  return html\`
    <details class="text-left" ?open=\${this.dropdown === "open"\}>
      \${this.href
        ? html\`
            <summary data-theme=\${btnTheme}>
              <a href=\${this.href}><slot></slot></a>
            </summary>
          \`
        : html\` <summary data-theme=\${btnTheme}><slot></slot></summary> \`}
      <slot name="dropdown"></slot>
    </details>
  \`
}
  `,

  responseFormat: "diff",
  strategy: "diff",
};
