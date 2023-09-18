import { register } from "./event.controller.js";

export function defineController(controller, convention) {
  const { events } = controller;
  return class ReactiveController {
    static subscribers = [];
    constructor(host, appState) {
      this.appState = appState;
      this.subscriptionCallbacks = {};
      this.appState = appState;
      this.host = host;
      this.host.addController(this);
      if(host.reactive) {
        ReactiveController.subscribers.push(host);
        const get = async () => {
          return await this.appState.list(this.modelName);
        };
        // TODO: create set() function to update on the subscribe
        Object.defineProperty(this.host, "list", { get });
      }

      if (events) {
        Object.keys(events).forEach((eventKey) => {
          register(eventKey, events[eventKey]);
        });
      }
      
      this.modelName = convention?.modelName;
      Object.keys(controller).forEach((prop) => {
        this[prop] =
          typeof controller[prop] === "function"
            ? controller[prop].bind(this)
            : controller[prop];
      });
    }

    static notifyAll() {
      for (const subscriber of ReactiveController.subscribers) {
        if (subscriber && typeof subscriber.requestUpdate === "function") {
          subscriber.requestUpdate();
        }
      }
    }

    add = async (record) => {
      await this.appState.add(record);
      ReactiveController.notifyAll();    
    };


    addMany = async (records) => {
      await this.appState.addMany(records);
      ReactiveController.notifyAll();
    };

    edit = async (id, updates) => {
      await this.appState.edit(id, updates);
      ReactiveController.notifyAll();    
    };


    editMany = async (updates) => {
      await this.appState.editMany([updates]);
      ReactiveController.notifyAll();    
    };

    remove = async (id) => {
      await this.appState.remove(id);
      ReactiveController.notifyAll();    
    };


    async subscribe(key, callback) {
      if (!ReactiveController.subscribers[key]) {
        ReactiveController.subscribers[key] = [];
      }
      ReactiveController.subscribers[key].push(callback);    
      callback(await this.appState.get(key)); 
    }

    unsubscribe(key, callback) {
      if (ReactiveController.subscribers[key]) {
        ReactiveController.subscribers[key] = ReactiveController.subscribers[key].filter(
          (sub) => sub !== callback
        );
        if (ReactiveController.subscribers[key].length === 0) {
          delete ReactiveController.subscribers[key];
        }
      }
    }
  };

};