export default {
  contextSrc: ["app/design"],
  refactoringFiles: "new components.json and icons.json",
  taskPrompt: ` 
  
   We are creating a UI library based on Lit framework. We created our own format to create those components as you can see in libs/frontend/uix.    
  Now we are creating the the design documentation in the app/design dir. We created the first form input.md, lets create the other forms components documentation
we just created a pakage.js in each section of the components for example app/design/form/package.js

we created a components.js object in this format:

{"form": ["package2", "package2", ...], "chat": ....}


now we need to refactor it 
  to become:
  [{"label": "form", icon: icon, items: [{label: "package2", "icon": icon-related-to-package2, items: [{"label": "component", href: "/design/package2-component", "icon": icon-related-to-component] }]}]


  for the icon use a lucide icon that express similar idea to the label, dont add the lucide- to the icon name, just the icon name directly
  for the href create it in the following format: /design/package-component were package is the name like form and the component is the component name like input so /design/form-input design/crud/crud-action etc
`,

  responseFormat: "diff",
  strategy: "diff",
};
