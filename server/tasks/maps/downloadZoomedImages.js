import fs from "fs";
import path from "path";

import mapServices from "../../services/maps/index.js";

export async function downloadZoomedImages(
  coord,
  outputFolderPath,
  { startZoom, endZoom, size, apiKey, mapType, provider, zoomStep = 1 },
) {
  const mapConfig = mapServices[provider];
  let x = 1;
  for (let zoom = startZoom; zoom <= endZoom; zoom += zoomStep) {
    try {
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
    } catch (error) {
      console.error(`Error downloading zoomed map image for zoom level ${zoom}:`, error);
    }
  }
}