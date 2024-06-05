export default {
  contextSrc: ["server/"],
  refactoringFiles: " affected files",
  taskPrompt: `  
   we created a server command line tool that intereact with our code base. We need now to create a new form of integration. It will have a github login/integration (through cli) and another task to create/connect to a project
   
   we already started the work so lets continue from it
   we want to refactor the github.js to use octokit in place of gh so it can run in the browser too
   if more things need to be refactored go ahead and do it like the login part (we will provide an .env variable that will be accessible through the settings object)

   be careful with the line codes and formatting the diff file please
   `,

  responseFormat: "diff",
  strategy: "diff",
};
