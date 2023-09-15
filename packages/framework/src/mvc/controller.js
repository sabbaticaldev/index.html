import { ReactiveController } from "../reactivity/reactive-controller";

export default function defineController(controller, convention) {
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


    addBulk = async (records) => {
      await this.appState.addBulk(records);
      console.log("notify all");
      ActionController.notifyAll();
    };

    edit = async (id, updates) => {
      await this.appState.edit(id, updates);
      ActionController.notifyAll();    
    };


    editBulk = async (updates) => {
      await this.appState.editBulk([updates]);
      ActionController.notifyAll();    
    };

    remove = async (id) => {
      await this.appState.remove(id);
      ActionController.notifyAll();    
    };
  };
};