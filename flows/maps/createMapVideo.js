import fs from "fs";
import path from "path";

import mapServices from "../../services/maps/index.js";
import { executeTasks } from "../../utils.js";
import { downloadMapImages } from "./downloadMapImages.js";
import { createAnimation } from "./createAnimation.js";

export async function createMapVideo(options) {
  const {
    start,
    end,
    apiKey,
    frameRate,
    duration,
    resolution,
    zoom,
    size,
    pathColor,
    pathWeight,
    mapType,
    provider = "google",
  } = options;
  const outputFolderPath = `downloads/route_${new Date().getTime()}`;
  fs.mkdirSync(outputFolderPath, { recursive: true });

  const mapConfig = mapServices[provider];
  const coordinates = await mapConfig.fetchRouteCoordinates(start, end, apiKey);
  const tasks = [
    {
      description: "Fetching route coordinates and downloading map images",
      operation: async () =>
        downloadMapImages(coordinates, outputFolderPath, {
          zoom,
          size,
          pathColor,
          pathWeight,
          apiKey,
          mapType,
          provider,
        }),
    },
    {
      description: "Creating animated video",
      operation: async () =>
        createAnimation(
          outputFolderPath,
          path.join(outputFolderPath, "route_animation.mp4"),
          {
            frameRate,
            duration,
            resolution,
          },
        ),
    },
  ];
  try {
    await executeTasks({ tasks });
  } catch (error) {
    console.error("Error creating map video:", error);
  }
}