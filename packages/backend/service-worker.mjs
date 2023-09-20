import { defineControllers } from "./scaffold/controller/reactive-controller.mjs";
import { defineModels } from "./scaffold/model/reactive-record.mjs";
console.log({ defineControllers, defineModels });
import models from "./models.mjs";
const definedModels = defineModels(models);
import controllers from "./controllers.mjs";
const definedControllers = defineControllers(controllers, models);
console.log({ definedControllers, definedModels });
// TODO: import the defineController and define the controllers, also inject the models
// and bind the correct controller to the handler event
let eventHandlers = {};

function handleEvent(event) {
  const { type, params } = event;

  if (eventHandlers[type]) {
    return Promise.all(
      eventHandlers[type].map((handler) => handler(params)),
    ).then((results) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage("REQUEST_UPDATE"));
      });
      return results;
    });
  }
  return Promise.reject(new Error("No handler for event type"));
}

// Function to register handlers in the service worker itself
function registerEventHandler(props) {
  const [eventType, handler] = props;
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = [];
  }
  if (!eventHandlers[eventType].includes(handler)) {
    eventHandlers[eventType].push(handler);
  } else {
    console.warn(
      `Handler is already registered for event type "${eventType}".`,
    );
  }
}

self.addEventListener("message", (event) => {
  if (event?.data.type) {
    handleEvent(event?.data);
  }
});

const api = Object.values(controllers)
  .map((module) => {
    if (module.events) {
      Object.entries(module.events).map(registerEventHandler);
    }
    return module.endpoints;
  })
  .filter(Boolean)
  .reduce(
    (acc, endpoints) => ({
      ...acc,
      ...endpoints,
    }),
    {},
  ); // Merge all endpoint objects into one

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// src/service-worker.js or src/service-worker.ts
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const result = api[url.pathname];
  if (result) {
    console.log(url.pathname, api[url.pathname]);
    event.respondWith(
      new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": Array.isArray(result)
            ? "text/event-stream"
            : "text/json",
        },
      }),
    );
  }
});
