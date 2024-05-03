import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { createReelRipOff } from "./tasks/instagram.js";
import { createMapVideo, createZoomInVideo } from "./tasks/maps.js";
import { CreateVideoFromImage } from "./tasks/video.js";

// Helper function to determine if input is a file and read JSON
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read or parse file:", error);
    throw error;  // Rethrow to handle it in the command handler
  }
};

// Helper function to parse input as JSON or return as URL
const parseInput = (input) => {
  try {
    if (input.endsWith(".json")) {
      return readJsonFile(input);
    }
    JSON.parse(input);
    return JSON.parse(input);
  } catch (error) {
    // Assuming input is a URL or a direct path
    return { url: input };
  }
};

yargs(hideBin(process.argv))
  .command("reel <input>", "Create an Instagram reel", (yargs) => {
    yargs.positional("input", {
      describe: "Path to a JSON configuration file or JSON string",
      type: "string"
    });
  }, async (argv) => {
    const config = parseInput(argv.input);
    await createReelRipOff(config);
  })
  .command("animate <input>", "Create an animated video from an image", (yargs) => {
    yargs.positional("input", {
      describe: "Path to a JSON configuration file or JSON string",
      type: "string"
    });
  }, async (argv) => {
    const config = parseInput(argv.input);
    await CreateVideoFromImage(config);
  })
  .command("map-route <input>", "Generate a video animation of a map route", (yargs) => {
    yargs.positional("input", {
      describe: "Path to a JSON configuration file or JSON string with route details",
      type: "string"
    });
  }, async (argv) => {
    const config = parseInput(argv.input);
    await createMapVideo(config);
  })
  .command("map-zoom <input>", "Generate a video animation of a map zoom", (yargs) => {
    yargs.positional("input", {
      describe: "Path to a JSON configuration file or JSON string with route details",
      type: "string"
    });
  }, async (argv) => {
    const config = parseInput(argv.input);
    await createZoomInVideo(config);
  })
  .demandCommand(1, "You must specify a command (reel, animate, or map-route) and provide necessary input.")
  .help()
  .parse();
