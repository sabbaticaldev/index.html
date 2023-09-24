import SystemeventController from "../plugins/events/systemevent.controller.mjs";
export const queue = [];

export function defineController(controller, models) {
  const { events } = controller;
  return class extends SystemeventController {
    static eventQueue = models.systemevent;

    constructor(host = {}, model) {
      super(host);
      this.host = host;
      this.host?.addController?.(this);
      this.constructor.model = model;
      this.modelName = model.name;
      if (host.reactive) {
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

    add = (record) => {
      console.log({record});
      return this.constructor.model.add(record).then(result => {        
        console.log("fuck off");
        return result;
      });
    };


    addMany = async (records) => {
      return this.constructor.model.addMany(records).then(result => {        
        return result;
      });
    };

    edit = async (updates) => {
      return this.constructor.model.edit(updates);
    };


    editMany = async (updates) => {
      return this.constructor.model.editMany([updates]);
    };

    remove = async (id) => {
      return this.constructor.model.remove(id);
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
