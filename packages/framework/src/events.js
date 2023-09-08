/**
 * @callback SubscriberCallback
 * @param {*} value
 */

/**
 * @callback EventHandler
 * @param {*} data
 */

/**
 * Class representing event handlers.
 */
export class EventHandlers {
    constructor() {
      /** @private @type {Object.<string, EventHandler>} */
      this.handlers = {};
    }
  
    /**
     * Register a handler for an event type.
     * @param {string} eventType - Type of the event.
     * @param {EventHandler} handler - The handler for the event.
     */
    register(eventType, handler) {
      this.handlers[eventType] = handler;
    }
  
    /**
     * Handle an event.
     * @param {*} event - The event to handle.
     */
    handle(event) {
      if (this.handlers[event.type]) {
        this.handlers[event.type](event);
      }
    }
  }
  
  /**
   * Class representing an event queue.
   */
  export class EventQueue {
    constructor() {
      /** @private @type {Array<*>} */
      this.queue = [];
    }
  
    /**
     * Enqueue an event.
     * @param {*} event - The event to enqueue.
     */
    enqueue(event) {
      this.queue.push(event);
      this.process();
    }
  
    /**
     * Process the event queue.
     * @private
     */
    process() {
      while (this.queue.length) {
        const event = this.queue.shift();
        eventHandlers.handle(event); // Assuming `eventHandlers` is a global reference. Modify if needed.
      }
    }
  }
  