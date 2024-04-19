import { exec } from "child_process";

export function generateCaptionImage(caption, config) {
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

  // Command to generate the image
  const command = `convert -size ${width}${height && `x${height}` || ""} ` +
                    `-background '${backgroundColor}' ` +
                    `-fill '${textColor}' ` +
                    "-gravity center " +
                    `-font '${font}' ` + 
                    `-pointsize ${pointsize} ` +
                    `pango:'${caption}' ` +
                    `-bordercolor '${backgroundColor}' -border ${padding} ` +
                    `${outputPath}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error generating caption image:", stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(outputPath);
      }
    });
  });
}

export function embedCaptionToImage({imagePath, captionPath, outputPath, top}) {
  const command = `convert ${imagePath} ${captionPath} -gravity ${top ? `north -geometry +0+${top}` : "center"} -composite ${outputPath}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error creating final image with caption:", stderr);
        reject(error);
      } else {
        console.log("Final image created successfully:", outputPath);
        resolve(outputPath);
      }
    });
  });
}
  