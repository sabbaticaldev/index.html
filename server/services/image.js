import { exec } from "child_process";
import util from "util";

export async function generateCaptionImage(caption, config) {  
  const {
    width = 900,
    height,
    pointsize = 38,
    borderColor = "",
    backgroundColor = "white", // Use 'none' for transparent background
    textColor = "#333333", // White text
    strokeColor = "white", // Black border
    strokeWidth = 2, // Default to no stroke, apply only if > 0
    padding = 20,
    font = "Arial",
    outputPath,
  } = config;
  // Step 1: Create base text image with Pango
  const baseTextCommand = `convert -size ${width}${height ? `x${height}` : ""} ` +
` -background ${backgroundColor}`  +
`${padding ? ` -bordercolor '${borderColor || backgroundColor}' -border ${padding} ` : " "}`+
` -fill '${textColor}' ` +
` -font '${font}' ` +
" -gravity center "+
` -pointsize ${pointsize} ` +
` pango:'${caption.replace(/'/g, "'\\''")}' ` +
` PNG32:${outputPath}-base.png`;

  // Step 2: Create stroke image
  const strokeTextCommand = `convert ${outputPath}-base.png ` +
  " -bordercolor 'none' -border 3 " +
  ` -alpha set -channel RGBA -morphology EdgeOut 'Diamond:${strokeWidth}' ` +
  ` PNG32:${outputPath}-stroke.png`;

  // Step 3: Colorize stroke
  const colorizeStrokeCommand = `convert ${outputPath}-stroke.png ` +
      `-fill '${strokeColor}' -colorize 100 ` +
      `PNG32:${outputPath}-stroke.png`;

  // Step 4: Composite the base text over the stroke
  const compositeCommand = `convert ${outputPath}-stroke.png ` +
 ` ${outputPath}-base.png ` +
 " -gravity center -composite " +
 ` -bordercolor 'none' -border ${padding} ` +
 ` ${outputPath}`;

  // Execute commands
  try {
    await execAsync(baseTextCommand);
    await execAsync(strokeTextCommand);
    await execAsync(colorizeStrokeCommand);
    const { stdout } = await execAsync(compositeCommand);
    console.log("Caption image created successfully:", outputPath);
    // Clean up intermediate images
    await execAsync(`rm -f ${outputPath}-base.png`);
    await execAsync(`rm -f ${outputPath}-stroke.png`);
    return outputPath;
  } catch (error) {
    console.error("Error generating caption image with border:", error);
    throw error; // Ensure the error can be caught by the calling function
  }
}

const execAsync = util.promisify(exec);

export async function embedCaptionToImage({ imagePath, captionPath, outputPath, top }) {
  console.log({top});
  const command = `convert ${imagePath} ${captionPath} -gravity ${top ? `north -geometry +0+${top}` : "center"} -composite ${outputPath}`;

  try {
    await execAsync(command);
    console.log("Final image created successfully:", outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error creating final image with caption:", error);
    throw new Error(`Failed to create image with caption: ${error.message}`);
  }
}
