import fs from "fs";
import path from "path";

import mapServices from "../../services/maps/index.js";

// Download and save map images using a specific map service
export async function downloadMapImages(coords, outputFolderPath, config, provider) {
  const mapConfig = mapServices[provider];
  for (const [index, { lat, lng }] of coords.entries()) {
    try {
      const buffer = await mapConfig.fetchMapImage({ ...config, lat, lng });
      const imagePath = path.join(outputFolderPath, `frame_${index}.png`);
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      console.log(`Image saved at ${imagePath}`);
    } catch (error) {
      console.error(`Error downloading map image for coordinates (${lat}, ${lng}):`, error);
    }
  }
}