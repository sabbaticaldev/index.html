import ffmpeg from "fluent-ffmpeg";

export async function embedCaptionToVideo({videoPath, captionPath, outputPath, captionDuration, top}) {  
  const overlayOptions = captionDuration
    ? `overlay=x=(main_w-overlay_w)/2:y=${top}:enable='between(t,0,${captionDuration})'`
    : `overlay=x=(main_w-overlay_w)/2:y=${top}`;  
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