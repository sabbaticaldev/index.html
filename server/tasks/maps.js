import polyline from "@mapbox/polyline";
import { exec } from "child_process";
import fs from "fs";
import fetch from "node-fetch"; // Import this if you're using node-fetch
import path from "path";
import util from "util";
const { decode: polylineDecode, encode: polylineEncode }  = polyline;
import { executeTasks }from "../utils.js";

const execAsync = util.promisify(exec);
const deps = {};

async function fetchRouteCoordinates(start, end, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const points = data.routes[0].overview_polyline.points;
  return polylineDecode(points);
}

async function createAnimation(imageFolder, outputFile, frameRate = 24, duration = 10, resolution = "1920x1080") {
  const inputPattern = path.join(imageFolder, "frame_%d.png");
  const ffmpegCommand = `ffmpeg -framerate ${frameRate} -i "${inputPattern}" -t ${duration} -s ${resolution} -c:v libx264 -r 30 -pix_fmt yuv420p "${outputFile}"`;
  await execAsync(ffmpegCommand);
}

async function downloadMapImages(coordinates, apiKey, outputFolderPath, mapConfig) {
  const { zoom, size, pathColor, pathWeight } = mapConfig;
  for (const [index, coord] of coordinates.entries()) {
    const [lat, lng] = coord;
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&path=color:${pathColor}|weight:${pathWeight}|enc:${polylineEncode(coordinates)}&key=${apiKey}`;
    const imagePath = path.join(outputFolderPath, `frame_${index}.png`);
    const response = await fetch(mapUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`Image saved at ${imagePath}`);
  }
}
  
export async function createMapVideo(options) {
  const { start, end, apiKey, frameRate = 24, duration = 10, 
    resolution = "1920x1080", zoom = 18, size = "600x400", pathColor = "0xff0000ff", pathWeight = 5 } = options;
    
  const routeId = new Date().getTime();
  const outputFolderPath = `downloads/route_${routeId}`;
  fs.mkdirSync(outputFolderPath, { recursive: true });
  
  const tasks = [
    {
      description: "Fetching route coordinates",
      operation: async () => await fetchRouteCoordinates(start, end, apiKey),
      key: "coordinates"
    },
    {
      description: "Downloading map images",
      dependencies: ["coordinates"],
      operation: async () => await downloadMapImages(deps.coordinates, apiKey, outputFolderPath, { zoom, size, pathColor, pathWeight })
    },
    {
      description: "Creating animated video",
      operation: async () => createAnimation(outputFolderPath, path.join(outputFolderPath, "route_animation.mp4"), frameRate, duration, resolution)
    }
  ];
  
  await executeTasks({ tasks, deps });
}

async function fetchSingleCoordinate(location, apiKey) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const response = await fetch(geocodeUrl);
  const data = await response.json();
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}
  
async function downloadZoomedImages(coord, apiKey, outputFolderPath, startZoom, endZoom, mapType) {
  for (let zoom = startZoom; zoom <= endZoom; zoom++) {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coord.lat},${coord.lng}&zoom=${zoom}&size=600x400&maptype=${mapType}&key=${apiKey}`;
    const imagePath = path.join(outputFolderPath, `frame_${zoom}.png`);
    const response = await fetch(mapUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`Zoom level ${zoom} image saved at ${imagePath}`);
  }
}
  
export async function createZoomInVideo(options) {
  const { location, apiKey, frameRate = 24, duration = 10, resolution = "1920x1080", startZoom = 1, endZoom = 21, mapType = "satellite" } = options;
    
  const pointId = new Date().getTime(); 
  const outputFolderPath = `downloads/zoom_${pointId}`;
  fs.mkdirSync(outputFolderPath, { recursive: true });
  
  const coord = await fetchSingleCoordinate(location, apiKey);
  
  const tasks = [
    {
      description: "Downloading zoomed map images",
      operation: async () => await downloadZoomedImages(coord, apiKey, outputFolderPath, startZoom, endZoom, mapType)
    },
    {
      description: "Creating zoom-in video",
      operation: async () => createAnimation(outputFolderPath, path.join(outputFolderPath, "zoom_animation.mp4"), frameRate, duration, resolution)
    }
  ];
  
  await executeTasks({ tasks, deps: {} });
}
  

  