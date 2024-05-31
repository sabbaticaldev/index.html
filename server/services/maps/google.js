// Dependencies
import polyline from "@mapbox/polyline";
const { decode: polylineDecode } = polyline;

import { MAP_TYPES } from "../../constants.js";
import { fetchMapImage } from "../../utils.js";

export default {
  fetchMapImage: async ({
    lat,
    lng,
    zoom,
    size,
    pathColor,
    pathWeight,
    apiKey,
    mapType,
  }) => {
    const googleMapType = MAP_TYPES[mapType]?.google || "roadmap";
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${googleMapType}&path=color:${pathColor}|weight:${pathWeight}&key=${apiKey}`;
    return fetchMapImage(mapUrl);
  },
  fetchRouteCoordinates: async (start, end, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const points = data.routes[0].overview_polyline.points;
    return polylineDecode(points);
  },
  fetchSingleCoordinate: async (location, apiKey) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location,
    )}&key=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    return data.results[0].geometry.location;
  },
};
