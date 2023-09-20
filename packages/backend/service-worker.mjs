import { defineControllers } from "./scaffold/controller/reactive-controller.mjs";
import { defineModels } from "./scaffold/model/reactive-record.mjs";
import modelList from "./models.mjs";
import controllerList from "./controllers.mjs";
const models = defineModels(modelList);
const controllers = defineControllers(controllerList, models);

// TODO: import the defineController and define the controllers, also inject the models
// and bind the correct controller to the handler event
let eventHandlers = {};
let eventControllerMap = {};
function handleEvent(event) {
  const { type, params } = event;
  if (eventHandlers[type]) {
    return Promise.all(
      eventHandlers[type].map((handler) =>
        handler.call(eventControllerMap[type], params),
      ),
    ).then((results) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage("REQUEST_UPDATE"));
      });
      return results;
    });
  }
  return Promise.reject(new Error("No handler for event type"));
}

function registerEventHandler(props, controllerName) {
  const [eventType, handler] = props;

  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = [];
    if (controllers[controllerName]) {
      eventControllerMap[eventType] = new controllers[controllerName](
        {},
        models[controllerName.replace("Controller", "Model")],
      );
    }
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

const api = Object.entries(controllerList)
  .map(([controllerName, module]) => {
    // import the events to registerEventHandler
    if (module.events) {
      Object.entries(module.events).map((props) =>
        registerEventHandler(props, controllerName),
      );
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
