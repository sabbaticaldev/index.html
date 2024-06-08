import fs from "fs";

import mapServices from "../../services/maps/index.js";
import { executeTasks } from "../../utils.js";
import { downloadZoomedImages } from "./downloadZoomedImages.js";
import { createAnimation } from "./createAnimation.js";

export async function createZoomInVideo(options) {
  const {
    location,
    apiKey,
    frameRate,
    duration,
    resolution,
    startZoom,
    endZoom,
    mapType,
    zoomStep,
    provider = "google",
    startHold,
    endHold,
  } = options;
  const outputFolderPath = `downloads/zoom_${new Date().getTime()}`;
  fs.mkdirSync(outputFolderPath, { recursive: true });

  const mapConfig = mapServices[provider];
  const coord = await mapConfig.fetchSingleCoordinate(location, apiKey);
  const tasks = [
    {
      description: "Downloading zoomed map images",
      operation: async () =>
        downloadZoomedImages(coord, outputFolderPath, {
          startZoom,
          endZoom,
          size: "600x400",
          apiKey,
          mapType,
          provider,
          zoomStep,
        }),
    },
    {
      description: "Creating zoom-in video",
      operation: async () =>
        createAnimation(
          outputFolderPath,
          path.join(outputFolderPath, "zoom_animation.mp4"),
          {
            frameRate,
            duration,
            resolution,
            startHold,
            endHold,
          },
        ),
    },
  ];

  try {
    await executeTasks({ tasks });
  } catch (error) {
    console.error("Error creating zoom-in video:", error);
  }
}