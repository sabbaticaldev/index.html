import ffmpeg from "fluent-ffmpeg";

export async function embedCaptionToVideo({videoPath, captionPath, outputPath, duration}) {  
  const overlayOptions = duration
    ? `overlay=x=(main_w-overlay_w)/2:y=150:enable='between(t,0,${duration})'`
    : "overlay=x=(main_w-overlay_w)/2:y=150";  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noAudio()
      .input(captionPath)
      .complexFilter([overlayOptions])
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
}



  
export async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      resolve(Math.floor(metadata.format.duration));
    });
  });
}