import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { createReelRipOff } from "./tasks/instagram.js";

// Helper function to check if the input is a file
const isFile = (path) => path.endsWith(".json");

// Helper function to read JSON from file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read or parse file", error);
    throw error;  // Rethrow to handle it in the main command handler
  }
};

yargs(hideBin(process.argv))
  .command("reel <config>", "Process an Instagram reel", (yargs) => {
    yargs.positional("config", {
      describe: "JSON string with all configuration options or path to JSON file",
      type: "string"
    });
  }, (argv) => {    
    try {
      // Check if the input is a file and process accordingly
      const config = isFile(argv.config) ? readJsonFile(argv.config) : JSON.parse(argv.config);
      createReelRipOff(config);
    }
    catch(error) {
      console.log({argv, error});
    }
  })
  .demandCommand(1, "You need to specify a task (reel) and provide a URL or path to a JSON file.")
  .help()
  .parse();
