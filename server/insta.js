import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import handleReel from "./tasks/reel.js";


yargs(hideBin(process.argv))
  .command("reel <config>", "Process an Instagram reel", (yargs) => {
    yargs.positional("config", {
      describe: "JSON string with all configuration options",
      type: "string"
    });
  }, (argv) => {    
    try {
      handleReel(JSON.parse(argv.config));
    }
    catch(error) {
      console.log({argv, error});
    }
  })
  .demandCommand(1, "You need to specify a task (reel) and provide a URL.")
  .help()
  .parse()
  .argv;