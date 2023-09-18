export const eventHandlers = {};
export const queue = [];


export const register = (eventType, handler) => {
  eventHandlers[eventType] = handler;
};
  
export const handle =(event) => {
  if (eventHandlers[event.type]) {
    eventHandlers[event.type](event);
  }
};

export const dispatchEvent = (key, params = {}) => {
  const eventObj = {
    type: key, 
    ...params
  };
  queue.push(eventObj);
  process();
};
  
export const process = () => {
  while (queue.length) {
    const event = queue.shift();
    eventHandlers.handle(event); 
  }
};