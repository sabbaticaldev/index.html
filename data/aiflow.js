const data = {
  projectPath: "https://github.com/sabbaticaldev/test-project.git",
  contextSrc: "packages/aiflow",
  taskPrompt: `
Lets refactor aiflow to have some new features. In place of passing the list of commands to runCLI like this:
import { runCLI } from "aiflow/utils/cli.js";
import { importPatchFile } from "aiflow/utils/diff.js";
import { importXmlFiles } from "aiflow/utils/xml.js";

import { GetTrends } from "../services/instagram.js";
import { createProject } from "../utils/github.js";
import { createTodoTasks } from "./github/todo-create.js";
import { runTodoTasks } from "./github/todo-run.js";
import { createReelRipOff } from "./instagram/createReelRipOff.js";
import { createMapVideo } from "./maps/createMapVideo.js";
import { createZoomInVideo } from "./maps/createZoomInVideo.js";
import { refactorFolder } from "./refactor.js";
import { CreateVideoFromImage } from "./video.js";

const commands = {
  reel: {
    description: "Create Instagram reel",
    operation: createReelRipOff,
  },
  animate: {
    description: "Create animated video from image",
    operation: CreateVideoFromImage,
  },
  "todo-create": {
    description: "Create TODO tasks for a project",
    operation: createTodoTasks,
  },
};

runCLI(commands);

\`\`\`


we will read the ./prompts/ folder and each folder will be one command

and the folders will be organized as follow:
prompts/
      - reel/
            - template.js / template.json
            - index.js
            - prompt.json

where 
- template.js or json is the prompt template. It can be one template or the js/json can be also an array of templates
- index.js is the function that will be called like 'createTodoTasks'
- prompt.json will have the prompt metadata like name, description, author, website, like a package.json  

!IMPORTANT! DONT MAKE UNNECESSARY OR COSMETIC CHANGES! NONE!
`,
};

export default data;
