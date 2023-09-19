import resolve from "@rollup/plugin-node-resolve";
import globImport from "rollup-plugin-glob-import";

export default {
  input: "src/service-worker.mjs",
  output: {
    file: "public/service-worker.js",
    format: "iife"
  },
  plugins: [resolve(), globImport()]
};