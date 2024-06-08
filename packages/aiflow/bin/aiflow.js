#!/usr/bin/env node

(async () => {
  const { start } = await import("../index.js");
  console.log({ start });
  start();
})();
