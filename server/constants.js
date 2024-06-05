export const MAP_TYPES = {
  satellite: { google: "satellite", mapbox: "satellite-streets-v12" },
  roadmap: { google: "roadmap", mapbox: "streets-v11" },
  terrain: { google: "terrain", mapbox: "outdoors-v11" },
  hybrid: { google: "hybrid", mapbox: "satellite-streets-v12" },
};

export const PREFILL_DIFF = `--- /dev/null
+++ .git/COMMIT_EDITMSG`;
