import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { GetTrends } from "../services/instagram.js";
import settings from "../settings.js";
import { connectToProject, createProject } from "../utils/github.js";
import { createTodoTasks } from "./github/todo-create.js";
import { runTodoTasks } from "./github/todo-run.js";
import { importPatchFile } from "./import/patch.js";
import { importXmlFiles } from "./import/xml.js";
import { createReelRipOff } from "./instagram/createReelRipOff.js";
import { createMapVideo } from "./maps/createMapVideo.js";
import { createZoomInVideo } from "./maps/createZoomInVideo.js";
import { refactorFolder } from "./refactor.js";
import { CreateVideoFromImage } from "./video.js";
// Helper function to determine if input is a file and read JSON or JS asynchronously
const readFile = async (filePath) => {
  const fullFilePath = path.resolve(settings.__dirname, "../", filePath);
  if (filePath.endsWith(".json")) {
    try {
      const data = fs.readFileSync(fullFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read or parse JSON file:", error);
      throw error;
    }
  } else if (filePath.endsWith(".js")) {
    try {
      const module = await import(`file://${fullFilePath}`);
      return module.default;
    } catch (error) {
      console.error("Failed to import JS module:", error);
      throw error;
    }
  } else {
    throw new Error("Unsupported file type");
  }
};

// Helper function to parse input as JSON/JS or return as URL
const parseInput = (input) => {
  try {
    if (input.endsWith(".json") || input.endsWith(".js")) {
      return readFile(input);
    }
    return { url: input }; // Assuming input is a URL or a direct path
  } catch (error) {
    console.error("Failed to parse input:", error);
    return { url: input };
  }
};

const yarg = yargs(hideBin(process.argv))
  .command(
    "reel <input>",
    "Create an Instagram reel",
    (yargs) => {
      yargs.positional("input", {
        describe: "Path to a JSON or JS configuration file or JSON string",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await createReelRipOff(config);
    },
  )
  .command(
    "animate <input>",
    "Create an animated video from an image",
    (yargs) => {
      yargs.positional("input", {
        describe: "Path to a JSON or JS configuration file or JSON string",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await CreateVideoFromImage(config);
    },
  )
  .command(
    "todo-create <input>",
    "Create TODO tasks for a project",
    (yargs) => {
      yargs.positional("input", {
        describe:
          "Path to a JSON or JS configuration file or JSON string with project details",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await createTodoTasks(config);
    },
  )
  .command("todo-run", "Run TODO tasks and fix them with LLM", async () => {
    await runTodoTasks();
  })
  .command(
    "github-project <input>",
    "Create or connect to a GitHub project",
    (yargs) => {
      yargs.positional("input", {
        describe:
          "Path to a JSON or JS configuration file or JSON string with project details",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      const { name, description, url } = config;
      const projectUrl = url ? url : await createProject(name, description);
      console.log({ projectUrl });
      if (projectUrl) await connectToProject(projectUrl);
    },
  )
  .command(
    "map-route <input>",
    "Generate a video animation of a map route",
    (yargs) => {
      yargs.positional("input", {
        describe:
          "Path to a JSON or JS configuration file or JSON string with route details",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await createMapVideo(config);
    },
  )
  .command(
    "map-zoom <input>",
    "Generate a video animation of a map zoom",
    (yargs) => {
      yargs.positional("input", {
        describe:
          "Path to a JSON or JS configuration file or JSON string with route details",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await createZoomInVideo(config);
    },
  )
  .command(
    "refactor <input>",
    "Refactor JavaScript files in a directory",
    (yargs) => {
      yargs.positional("input", {
        describe:
          "Path to a JSON or JS configuration file or JSON string with refactoring details",
        type: "string",
      });
    },
    async (argv) => {
      const config = await parseInput(argv.input);
      await refactorFolder(config);
    },
  )
  .command(
    "applyPatch <input>",
    "Apply the patch file",
    (yargs) => {
      yargs.positional("input", {
        describe: "Path to an git patch file with files changes",
        type: "string",
      });
    },
    async (argv) => {
      await importPatchFile(argv.input);
    },
  )
  .command(
    "importXml <input>",
    "Import files from an XML file",
    (yargs) => {
      yargs.positional("input", {
        describe: "Path to an XML file with file import details",
        type: "string",
      });
    },
    async (argv) => {
      const xmlFilePath = argv.input;
      await importXmlFiles(xmlFilePath);
    },
  )
  .command(
    "get-trends <type>",
    "Fetch trending data from Instagram",
    (yargs) => {
      yargs.positional("type", {
        describe: "Type of trends to fetch (hashtags, reels, creators)",
        type: "string",
      });
    },
    async (argv) => {
      const { type } = argv;
      console.log(`Fetching trends for ${type}...`);
      return await GetTrends(type);
    },
  )
  .command(
    "get-media <type> <url>",
    "Fetch specific media from Instagram",
    (yargs) => {
      yargs
        .positional("type", {
          describe: "Type of media to fetch (reel, story, post)",
          type: "string",
        })
        .positional("url", {
          describe: "URL of the media to fetch",
          type: "string",
        });
    },
    async (argv) => {
      const { type, url } = argv;
      console.log(`Fetching media type: ${type} from ${url}...`);
    },
  );

yarg
  .demandCommand(
    1,
    "You must specify a command (reel, animate, map-route, map-zoom, refactor, importXml, get-trends, or get-media) and provide necessary input.",
  )
  .help()
  .parse();
