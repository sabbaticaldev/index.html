import { exec } from "child_process";
import path from "path";
import util from "util";

const execAsync = util.promisify(exec);

export async function createAnimation(
  imageFolder,
  outputFile,
  {
    frameRate = 24,
    duration = 10,
    resolution = "1920x1080",
    startHold = 1,
    endHold = 1,
  },
) {
  const inputPattern = path.join(imageFolder, "frame_%d.png");
  const totalDuration = duration + startHold + endHold; // Adjust total duration to account for hold frames

  // Construct the ffmpeg command with tpad for holding the first and last frames
  const ffmpegCommand =
    `ffmpeg -framerate ${frameRate} -i "${inputPattern}" ` +
    `-vf "tpad=start_duration=${startHold}:start_mode=clone:stop_duration=${endHold}:stop_mode=clone" ` + // Add tpad filter with clone
    `-t ${totalDuration} -s ${resolution} -c:v libx264 -r ${frameRate} -pix_fmt yuv420p "${outputFile}"`;

  try {
    await execAsync(ffmpegCommand);
    console.log("Animation created successfully");
    return outputFile;
  } catch (error) {
    console.error("Error creating animation:", error);
    throw error;
  }
}
