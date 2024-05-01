import { exec } from "child_process";
import fs from "fs";
import util from "util";

export async function generateCaptionImage(caption, config) {  
  const {
    width = 900,
    height,
    pointsize = 38,
    borderColor = "",
    backgroundColor = "none", // Use 'none' for transparent background
    textColor = "white", // White text
    strokeColor = "black", // Black border
    strokeWidth = 0, // Default to no stroke, apply only if > 0
    padding = 0,
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
    await execAsync(compositeCommand);
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
export async function embedCaptionToImage({ imagePath, flip, captionPath, outputPath, captionPosition }) {  
  // First, check if flipping is needed and handle it
  const tempImagePath = flip ? `${outputPath}-temp.png` : imagePath;
  const flipCommand = flip ? `convert ${imagePath} -flop ${tempImagePath}` : "";

  if (flip) {
    await execAsync(flipCommand);
  }

  // Get dimensions of the caption image
  const captionHeightCommand = `identify -format "%h" ${captionPath}`;
  const captionHeight = parseInt(await execAsync(captionHeightCommand).then(output => output.stdout.trim()));

  // Calculate the overlay position based on the caption height and video/image height
  const imageHeightCommand = `identify -format "%h" ${tempImagePath}`;
  const imageHeight = parseInt(await execAsync(imageHeightCommand).then(output => output.stdout.trim()));
  let overlayYPosition = captionPosition;
  if (captionPosition === "top") {
    overlayYPosition = imageHeight * 0.1;  // 10% from the top
  } else if (captionPosition === "bottom") {
    overlayYPosition = imageHeight - (imageHeight * 0.1 + captionHeight);  // 10% from the bottom plus caption height
  } else if (captionPosition === "center") {
    overlayYPosition = (imageHeight / 2) - (captionHeight / 2);  // Centered vertically
  }

  const command = `convert ${tempImagePath} ${captionPath} -gravity north -geometry +0+${overlayYPosition} -composite ${outputPath}`;
  console.log({captionPosition, command});
  try {
    await execAsync(command);
    console.log("Final image created successfully:", outputPath);
    if (flip) {
      fs.unlinkSync(tempImagePath);
    }
    return outputPath;
  } catch (error) {
    console.error("Error creating final image with caption:", error);
    throw new Error(`Failed to create image with caption: ${error.message}`);
  }
}
