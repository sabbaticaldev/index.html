import { ReactiveController } from "../reactivity/reactive-controller";

export default class ActionController extends ReactiveController {
  constructor(host, appState) {
    super(appState);
    this.appState = appState;
    this.host = host;
    this.host.addController(this);
    this.constructor.subscribers.push(host);
    const get = async () => await this.appState.list(this.modelName);
    Object.defineProperty(this.host, "list", { get });
  }

  add = async (record) => {
    await this.appState.add(record);    
    ActionController.notifyAll();    
  };

  edit = async (id, updates) => {
    await this.appState.edit(id, updates);
    ActionController.notifyAll();    
  };

  remove = async (id) => {
    await this.appState.remove(id);
    ActionController.notifyAll();    
  };
}