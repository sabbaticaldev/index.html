import SystemeventController from "../plugins/events/systemevent.controller.js";
export const queue = [];

export function defineController(controller, convention, models) {
  const { events } = controller;
  return class extends SystemeventController {
    static eventQueue = models.systemevent;
    static subscribers = [];

    constructor(host, appState) {
      super(host);
      this.host = host;
      this.host.addController(this);
      this.constructor.appState = appState;
      this.modelName = convention?.modelName;
      if (host.reactive) {
        this.constructor.subscribers.push(host);
        const get = async () => {
          return await this.constructor.appState.list(this.modelName);
        };
        // TODO: remove some logic from constructor and instantiate just one of each controller (attaching the same to multiple components)
        Object.defineProperty(this.host, "list", { get });
      }
      if (events) {
        Object.keys(events).forEach((eventKey) => {          
          SystemeventController.register(eventKey, events[eventKey]);
        });
      }

      Object.keys(controller).forEach((prop) => {
        this[prop] = 
          typeof controller[prop] === "function"
            ? controller[prop].bind(this)
            : controller[prop];
      });
    }

    static notifyAll() {
      if(this.subscribers?.length > 0) {
        for (const subscriber of this.subscribers) {
          if (subscriber && typeof subscriber.requestUpdate === "function") {
            subscriber.requestUpdate();
          }
        }
      }
    }

    static async subscribe(key, callback) {
      if (!this.subscribers[key]) {
        this.subscribers[key] = [];
      }
      this.subscribers[key].push(callback);    
      callback(await this.appState.get(key)); 
    }

    static unsubscribe(key, callback) {
      if (this.subscribers[key]) {
        this.subscribers[key] = this.subscribers[key].filter(
          (sub) => sub !== callback
        );
        if (this.subscribers[key].length === 0) {
          delete this.subscribers[key];
        }
      }
    }

    add = async (record) => {    
      await this.constructor.appState.add(record);
      this.constructor.notifyAll();    
    };


    addMany = async (records) => {
      await this.constructor.appState.addMany(records);
      this.constructor.notifyAll();
    };

    edit = async (id, updates) => {
      await this.constructor.appState.edit(id, updates);
      this.constructor.notifyAll();    
    };


    editMany = async (updates) => {
      await this.constructor.appState.editMany([updates]);
      this.constructor.notifyAll();    
    };

    remove = async (id) => {
      await this.constructor.appState.remove(id);
      this.constructor.notifyAll();    
    };
  };
}
