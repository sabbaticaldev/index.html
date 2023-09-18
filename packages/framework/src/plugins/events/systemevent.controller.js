const eventHandlers = {};

export default class SystemeventController {
  static register = (eventType, handler) => {
    if (!eventHandlers[eventType]) {
      eventHandlers[eventType] = [handler];
    } else {
      if (!eventHandlers[eventType].includes(handler)) {
        eventHandlers[eventType].push(handler);
      } else {
        console.warn(`Handler is already registered for event type "${eventType}".`);
      }
    }
  };
    
  handle(id, { type, params }) {
    if (eventHandlers[type]) {
      eventHandlers[type].forEach(handler => {
        try { 
          handler.bind(this)(params);
          this.constructor.eventQueue.remove(id);
        }
        catch(error) {
          console.error("Error:", {error});
        }
      }
      );
    }
  };
  
  dispatchEvent(key, params = {}) {
    const eventObj = {
      type: key, 
      params
    };
    this.constructor.eventQueue.add(eventObj).then(({id, ...params}) => this.handle(id, params || {}));
  };
};