const eventHandlers = {};

export default class SystemeventController {
  static register(eventType, handler) {
    if (!eventHandlers[eventType]) {
      eventHandlers[eventType] = [];
    }

    if (!eventHandlers[eventType].includes(handler)) {
      eventHandlers[eventType].push(handler);
    } else {
      console.warn(`Handler is already registered for event type "${eventType}".`);
    }
  }
    
  async handle(id, { type, params }) {
    if (!eventHandlers[type]) {
      return [];
    }
    
    const results = await Promise.all(eventHandlers[type].map(async handler => {
      try {
        const result = await handler.call(this, params);
        this.constructor.eventQueue.remove(id);
        return result;
      } catch (error) {
        console.error("Error:", { error });
        throw error;  // propagate the error so it can be handled by the caller
      }
    }));

    return results; // returns an array of results from each handler
  }
  
  async dispatchEvent(key, params = {}) {
    const eventObj = {
      type: key, 
      params
    };

    const { id, ...rest } = await this.constructor.eventQueue.add(eventObj);
    const results = await this.handle(id, rest);
    return results;  // returns an array of results from all handlers for the event
  }
}
