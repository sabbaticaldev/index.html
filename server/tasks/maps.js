import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import mapServices from "../services/maps/index.js";
import { executeTasks } from "../utils.js";

const execAsync = util.promisify(exec);

// Download and save map images using a specific map service
async function downloadMapImages(coords, outputFolderPath, config, provider) {
  const mapConfig = mapServices[provider];
  for (const [index, { lat, lng }] of coords.entries()) {
    const buffer = await mapConfig.fetchMapImage({ ...config, lat, lng });
    const imagePath = path.join(outputFolderPath, `frame_${index}.png`);
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`Image saved at ${imagePath}`);
  }
}

async function downloadZoomedImages(
  coord,
  outputFolderPath,
  { startZoom, endZoom, size, apiKey, mapType, provider, zoomStep = 1 },
) {
  const mapConfig = mapServices[provider];
  let x = 1;
  for (let zoom = startZoom; zoom <= endZoom; zoom += zoomStep) {
    const buffer = await mapConfig.fetchMapImage({
      lat: coord.lat,
      lng: coord.lng,
      zoom,
      size,
      apiKey,
      mapType,
    });
    const imagePath = path.join(outputFolderPath, `frame_${x++}.png`);
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`Zoom level ${zoom} image saved at ${imagePath}`);
  }
}

async function createAnimation(
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

  await execAsync(ffmpegCommand);
  console.log("Animation created successfully");
}

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
  await executeTasks({ tasks });
}
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

  await executeTasks({ tasks });
}
