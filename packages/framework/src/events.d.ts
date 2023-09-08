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
    /** @private @type {Object.<string, EventHandler>} */
    private handlers;
    /**
     * Register a handler for an event type.
     * @param {string} eventType - Type of the event.
     * @param {EventHandler} handler - The handler for the event.
     */
    register(eventType: string, handler: EventHandler): void;
    /**
     * Handle an event.
     * @param {*} event - The event to handle.
     */
    handle(event: any): void;
}
/**
 * Class representing an event queue.
 */
export class EventQueue {
    /** @private @type {Array<*>} */
    private queue;
    /**
     * Enqueue an event.
     * @param {*} event - The event to enqueue.
     */
    enqueue(event: any): void;
    /**
     * Process the event queue.
     * @private
     */
    private process;
}
export type SubscriberCallback = (value: any) => any;
export type EventHandler = (data: any) => any;
