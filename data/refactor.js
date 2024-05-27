export default {
  contextSrc: ["server/src/"],
  refactoringFiles: "files affected by the change",
  taskPrompt: `
  we have tasks that are run like pnpm tasks reel reel.json and pnpm tasks refactor refactor.json
  now I want to crete one that will be pnpm tasks importXml file.xml
  the tasks/index.js is already refactored, no need to give me it
  
  it will have the format: 
  <files><item><filepath><![CDATA[src/utils.js]]></filepath><content><![CDATA[<html>Refactored file content here &&</html>]]></content></item><item><filepath><![CDATA[src/models.js]]></filepath><content><![CDATA[<html>Refactored file content here</html>]]></content></item></files>

  and it should import the files to the filepath specified and the content just like the last parts of pnpm tasks refactor
  `,
  responseFormat: "xml",
};
