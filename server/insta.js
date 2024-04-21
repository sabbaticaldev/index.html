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
  .option("content-style", {
    alias: "c",
    type: "string",
    describe: "Descriptive style for LLM to generate content",
    default: "default"
  })
  .option("caption-style", {
    alias: "cs",
    type: "string",
    describe: "Descriptive style for LLM to generate the caption",
    default: "default"
  })
  .option("caption", {
    alias: "cap",
    type: "string",
    describe: "Provide a full caption, skipping generation"
  })
  .command("reel <url>", "Process an Instagram reel", (yargs) => {
    yargs.positional("url", {
      describe: "Instagram URL",
      type: "string"
    });
  }, (argv) => {    
    handleReel(argv.url, {
      captionDuration: argv["caption-duration"],
      contentStyle: argv["content-style"],
      captionStyle: argv["caption-style"],
      directCaption: argv.caption
    });
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