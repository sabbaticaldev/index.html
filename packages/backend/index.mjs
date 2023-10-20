import webworker from "./src/web-worker.mjs";

const { postMessage, initializeApp, worker } = webworker;

export { postMessage, initializeApp, worker };
