import { exec } from "child_process";
import util from "util";

export async function generateCaptionImage(caption, config) {
  const {
    width = 1500,
    height, 
    pointsize = 100, 
    backgroundColor = "none", 
    textColor = "black",
    padding = 20, 
    font = "Arial",
    outputPath
  } = config;

  // Construct the command to generate the image
  const command = `convert -size ${width}${height ? `x${height}` : ""} ` +
                  `-background '${backgroundColor}' ` +
                  `-fill '${textColor}' ` +
                  "-gravity center " +
                  `-font '${font}' ` + 
                  `-pointsize ${pointsize} ` +
                  `pango:'${caption}' ` +
                  `-bordercolor '${backgroundColor}' -border ${padding} ` +
                  `${outputPath}`;
  
  try {
    const { stdout } = await execAsync(command);
    console.log("Caption image created successfully:", outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error generating caption image:", error);
    throw error; // Throw to ensure the error can be caught by calling functions
  }
}

const execAsync = util.promisify(exec);

export async function embedCaptionToImage({ imagePath, captionPath, outputPath, top }) {
  const command = `convert ${imagePath} ${captionPath} -gravity ${top ? `north -geometry +0+${top}` : "center"} -composite ${outputPath}`;

  try {
    const { stdout } = await execAsync(command);
    console.log({stdout});
    console.log("Final image created successfully:", outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error creating final image with caption:", error);
    throw new Error(`Failed to create image with caption: ${error.message}`);
  }
}
