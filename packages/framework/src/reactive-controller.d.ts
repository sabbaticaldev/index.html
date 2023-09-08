export const eventHandlers: EventHandlers;
export const eventQueue: EventQueue;
export class ReactiveController {
    constructor(appState: any);
    /** @private @type {Object} */
    private subscribers;
    /** @private @type {Object} */
    private eventHandlers;
    appState: any;
    subscriptionCallbacks: {};
    /**
     * Subscribe to state changes based on a key.
     * @param {string} key
     * @param {function} callback
     */
    subscribe(key: string, callback: Function): void;
    /**
     * Unsubscribe a callback from a key.
     * @param {string} key
     * @param {function} callback
     */
    unsubscribe(key: string, callback: Function): void;
    notify(key: any, newValue: any): void;
    /**
     * Register an event handler.
     * @param {string} event
     * @param {function} handler
     */
    /**
     * Example of extending with an event handler.
    initHandlers() {
      this.on('TOGGLE_DARK_MODE', () => {
        this.setState('darkMode', !this.state.get('darkMode'));
      });
    }
     */
    on(event: any, handler: any): void;
}
import { EventHandlers } from "./events";
import { EventQueue } from "./events";
