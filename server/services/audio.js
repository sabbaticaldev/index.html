import AWS from "aws-sdk";
import ffmpeg from "fluent-ffmpeg";

// Function to extract audio from video
export async function extractAudio(videoPath) {
  const audioPath = `downloads/audio-${Date.now()}.wav`;
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("pcm_s16le")
      .toFormat("wav")
      .on("end", () => resolve(audioPath))
      .on("error", (err) => reject(err))
      .run();
  });
}

export async function transcribeAudio(audioPath) {
  const transcribeService = new AWS.TranscribeService();

  const jobName = `TranscriptionJob-${Date.now()}`;
  const audioUri = `file://${audioPath}`;

  const params = {
    LanguageCode: "en-US",
    Media: { MediaFileUri: audioUri },
    MediaFormat: "wav",
    TranscriptionJobName: jobName,
    OutputBucketName: process.env.AWS_S3_BUCKET,
  };

  // Start the transcription job
  await transcribeService.startTranscriptionJob(params).promise();

  // Poll the transcription job status
  return new Promise((resolve, reject) => {
    const checkJobDone = setInterval(async () => {
      try {
        const job = await transcribeService
          .getTranscriptionJob({ TranscriptionJobName: jobName })
          .promise();
        if (job.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
          clearInterval(checkJobDone);
          // Fetch the transcription from the specified S3 bucket or from the URI provided in the job
          resolve(job.TranscriptionJob.Transcript.TranscriptFileUri);
        } else if (job.TranscriptionJob.TranscriptionJobStatus === "FAILED") {
          clearInterval(checkJobDone);
          reject(new Error("Transcription failed"));
        }
      } catch (error) {
        clearInterval(checkJobDone);
        reject(error);
      }
    }, 5000); // Check every 5 seconds
  });
}
