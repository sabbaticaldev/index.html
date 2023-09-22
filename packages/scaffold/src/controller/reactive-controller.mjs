import SystemeventController from "../plugins/events/systemevent.controller.mjs";
export const queue = [];

export function defineController(controller, models) {
  const { events } = controller;
  return class extends SystemeventController {
    static eventQueue = models.systemevent;
    static subscribers = [];

    constructor(host = {}, model) {
      super(host);
      this.host = host;
      this.host?.addController?.(this);
      this.constructor.model = model;
      this.modelName = model.name;
      if (host.reactive) {
        this.constructor.subscribers.push(host);
        const get = async () => {
          return await this.constructor.model.list();
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
      callback(await this.model.get(key)); 
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

    add = (record) => {
      return this.constructor.model.add(record).then(result => {
        console.log("addeddando", {record});
        this.constructor.notifyAll();
        return result;
      });
    };


    addMany = async (records) => {
      return this.constructor.model.addMany(records).then(result => {
        this.constructor.notifyAll();
        return result;
      });
    };

    edit = async (id, updates) => {
      return this.constructor.model.edit(id, updates).then(result => {
        this.constructor.notifyAll();
        return result;
      });
    };


    editMany = async (updates) => {
      return this.constructor.model.editMany([updates]).then(result => {
        this.constructor.notifyAll();
        return result;
      });
    };

    remove = async (id) => {
      return this.constructor.model.remove(id).then(result => {
        this.constructor.notifyAll();
        return result;
      });  
    };
  };
}



export const defineControllers = (controllers, models) => {
  return Object.fromEntries(
    Object.entries(controllers).map(([name, module]) => [
      name,
      defineController(module, models),
    ])
  );
};
