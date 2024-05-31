import { exec } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import util from "util";

const execAsync = util.promisify(exec);

export async function embedCaptionToVideo({
  videoPath,
  captionPath,
  outputPath,
  captionDuration,
  captionPosition,
  invert,
}) {
  const flipFilter = invert ? "hflip," : "";

  // Get dimensions of the caption image
  const captionHeightCommand = `identify -format "%h" ${captionPath}`;
  const captionHeight = parseInt(
    await execAsync(captionHeightCommand).then((output) =>
      output.stdout.trim(),
    ),
  );

  // Determine the height of the video
  const getVideoHeight = async () => {
    const command = `ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 ${videoPath}`;
    const height = await execAsync(command).then((output) =>
      output.stdout.trim(),
    );
    return parseInt(height);
  };

  const videoHeight = await getVideoHeight();
  let overlayYPosition = captionPosition;
  if (captionPosition === "top") {
    overlayYPosition = videoHeight * 0.1; // 10% from the top
  } else if (captionPosition === "bottom") {
    overlayYPosition = videoHeight - (videoHeight * 0.1 + captionHeight); // 10% from the bottom plus caption height
  } else if (captionPosition === "center") {
    overlayYPosition = videoHeight / 2 - captionHeight / 2; // Centered vertically
  }

  const overlayOptions = captionDuration
    ? `overlay=x=(main_w-overlay_w)/2:y=${overlayYPosition}:enable='between(t,0,${captionDuration})'`
    : `overlay=x=(main_w-overlay_w)/2:y=${overlayYPosition}`;

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noAudio()
      .input(captionPath)
      .complexFilter([`${flipFilter}${overlayOptions}`])
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
}
export async function createGridVideo({
  videoPath,
  captionPath,
  outputPath,
  captionDuration,
  captionPositon,
  invert,
}) {
  const flipFilter = invert ? "hflip," : "";
  const overlayOptions = captionDuration
    ? `overlay=x=(main_w-overlay_w)/2:y=${captionPositon}:enable='between(t,0,${captionDuration})'`
    : `overlay=x=(main_w-overlay_w)/2:y=${captionPositon}`;
  1;
  return new Promise((resolve, reject) => {
    const command = ffmpeg(videoPath).noAudio().input(captionPath);
    command.complexFilter([`${flipFilter}${overlayOptions}`]);
    command
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
}
