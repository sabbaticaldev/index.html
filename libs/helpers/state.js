// eventEmitter.js
const createEventEmitter = () => {
  let events = {};

  const on = (event, listener) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  };

  const off = (event, listener) => {
    if (!events[event]) return;
    events[event] = events[event].filter((l) => l !== listener);
  };

  const emit = (event, data) => {
    if (!events[event]) return;
    events[event].forEach((listener) => listener(data));
  };

  return { on, off, emit };
};

export const eventEmitter = createEventEmitter();
const state = {
  Theme: null,
};

export const getState = (key) => {
  return key ? state[key] : state;
};

export const setState = (newState) => {
  Object.keys(newState).forEach((key) => {
    state[key] = newState[key];
    eventEmitter.emit(`stateChange:${key}`, state[key]);
    event({ type: "stateChange", key, value: state[key] });
  });
};

export const subscribe = (key, listener) => {
  eventEmitter.on(`stateChange:${key}`, listener);
};

export const unsubscribe = (key, listener) => {
  eventEmitter.off(`stateChange:${key}`, listener);
};

export function event(type, ...attrs) {
  const message = { type };
  attrs.forEach((attr) => {
    Object.assign(message, attr);
  });
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

navigator.serviceWorker.addEventListener("message", (event) => {
  const { type, key, value } = event.data;
  if (type === "stateChange") {
    state[key] = value;
    eventEmitter.emit(`stateChange:${key}`, value);
  }
});
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
