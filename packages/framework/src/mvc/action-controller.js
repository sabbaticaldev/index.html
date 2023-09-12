import { ReactiveController } from "../reactivity/reactive-controller";

export default class ActionController extends ReactiveController {
  constructor(host, appState) {
    super(appState);
    this.appState = appState;
    this.host = host;
    this.host.addController(this);
    this.constructor.subscribers.push(host);
    const get = () =>  this.appState.list(this.modelName);
    Object.defineProperty(this.host, "list", { get });
  }

  add = (record) => {
    this.appState.add(record);
    ActionController.notifyAll();
    return true; 
  };

  edit = (id, updates) => {
    this.appState.edit(id, updates);
    ActionController.notifyAll();    
  };

  remove = (id) => {
    this.appState.remove(id);
    ActionController.notifyAll();    
  };
}