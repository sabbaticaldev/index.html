// Dependencies
import polyline from "@mapbox/polyline";
const { decode: polylineDecode } = polyline;
import { MAP_TYPES } from "../../constants.js";
import { fetchMapImage } from "../../utils/maps.js";

export default {
  fetchMapImage: async ({ lat, lng, zoom, size, apiKey, mapType }) => {
    const mapboxMapType = MAP_TYPES[mapType]?.mapbox || "streets-v11";
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/${mapboxMapType}/static/${lng},${lat},${zoom}/${size}?access_token=${apiKey}`;
    return fetchMapImage(mapUrl);
  },
  fetchRouteCoordinates: async (start, end, apiKey) => {
    const startEncoded = encodeURIComponent(start);
    const endEncoded = encodeURIComponent(end);
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startEncoded};${endEncoded}?access_token=${apiKey}&geometries=polyline`;
    const response = await fetch(directionsUrl);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const polyline = data.routes[0].geometry;
      return polylineDecode(polyline);
    }
    return [];
  },
  fetchSingleCoordinate: async (location, apiKey) => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location,
    )}.json?access_token=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const { center } = data.features[0];
      return { lat: center[1], lng: center[0] };
    }
    return null;
  },
};
