import { EventHandlers, EventQueue } from "./event.controller.js";

export const eventHandlers = new EventHandlers();
export const eventQueue = new EventQueue();

export class ReactiveController {


  static subscribers = [];
    
  constructor(appState) {
    /** @private @type {Object} */
    this.subscribers = {};
    /** @private @type {Object} */
    this.eventHandlers = {};
    this.appState = appState;
    this.subscriptionCallbacks = {};
  }

  /**
     * Subscribe to state changes based on a key.
     * @param {string} key 
     * @param {function} callback 
     */
  async subscribe(key, callback) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    this.subscribers[key].push(callback);    
    callback(await this.appState.get(key)); // Get initial value if exists
  }

  /**
     * Unsubscribe a callback from a key.
     * @param {string} key 
     * @param {function} callback 
     */
  unsubscribe(key, callback) {
    if (this.subscribers[key]) {
      this.subscribers[key] = this.subscribers[key].filter(
        (sub) => sub !== callback
      );
      if (this.subscribers[key].length === 0) {
        delete this.subscribers[key];
      }
    }
  }

  /**
     * Notify all subscribers of a particular key about its new value.
     * @param {string} key 
     * @param {*} newValue 
     */
  notify(key, newValue) {
    if (this.subscribers[key]) {
      for (const callback of this.subscribers[key]) {
        callback(newValue);
      }
    }
  }
    
  static notifyAll() {
    for (const subscriber of ReactiveController.subscribers) {
      console.log({subscriber});
      if (subscriber && typeof subscriber.requestUpdate === "function") {
        subscriber.requestUpdate();
      }
    }
  }

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
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }
}

export function defineController(controller, convention) {
  return class ActionController extends ReactiveController {
    constructor(host, appState) {
      super(host, appState);
      this.appState = appState;
      this.host = host;
      this.host.addController(this);
      if(host.reactive) {
        this.constructor.subscribers.push(host);
        const get = async () => {
          return await this.appState.list(this.modelName);
        };
        // TODO: create set() function to update on the subscribe
        Object.defineProperty(this.host, "list", { get });
      }
      
      this.modelName = convention?.modelName;
      Object.keys(controller).forEach((prop) => {
        this[prop] =
          typeof controller[prop] === "function"
            ? controller[prop].bind(this)
            : controller[prop];
      });
    }

    add = async (record) => {
      await this.appState.add(record);
      ActionController.notifyAll();    
    };


    addMany = async (records) => {
      await this.appState.addMany(records);
      ActionController.notifyAll();
    };

    edit = async (id, updates) => {
      await this.appState.edit(id, updates);
      ActionController.notifyAll();    
    };


    editMany = async (updates) => {
      await this.appState.editMany([updates]);
      ActionController.notifyAll();    
    };

    remove = async (id) => {
      await this.appState.remove(id);
      ActionController.notifyAll();    
    };
  };
};