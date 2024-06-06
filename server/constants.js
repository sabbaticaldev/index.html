export const MAP_TYPES = {
  satellite: { google: "satellite", mapbox: "satellite-streets-v12" },
  roadmap: { google: "roadmap", mapbox: "streets-v11" },
  terrain: { google: "terrain", mapbox: "outdoors-v11" },
  hybrid: { google: "hybrid", mapbox: "satellite-streets-v12" },
};

export const PREFILL_DIFF = `--- /dev/null
+++ .git/COMMIT_EDITMSG`;

export const PREFILL_JSON = "{";

export const PREFILL_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
