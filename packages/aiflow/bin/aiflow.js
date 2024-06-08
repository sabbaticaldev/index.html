#!/usr/bin/env node

/**
 * Main entry point for the aiflow CLI.
 * Imports and starts the aiflow application.
 */
(async () => {
  const { start } = await import("../index.js");
  start();
})();
