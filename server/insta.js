import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import handleReel from "./tasks/reel.js";
import handleStory from "./tasks/story.js";

yargs(hideBin(process.argv))
  .option("caption-duration", {
    alias: "d",
    type: "number",
    description: "Duration for which the caption is displayed in seconds"
  })
  .command("reel <url>", "Process an Instagram reel", (yargs) => {
    yargs.positional("url", {
      describe: "Instagram URL",
      type: "string"
    });
  }, (argv) => {
    handleReel(argv.url, argv.captionDuration);
  })
  .command("story <url>", "Process an Instagram story", (yargs) => {
    yargs.positional("url", {
      describe: "Instagram URL",
      type: "string"
    });
  }, (argv) => {
    handleStory(argv.url, argv.captionDuration);
  })
  .demandCommand(1, "You need to specify a task (reel or story) and provide a URL.")
  .help()
  .argv;