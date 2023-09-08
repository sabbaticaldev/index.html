import { ReactiveController } from './reactive-controller';

export default class ActionController extends ReactiveController {
  constructor(host, appState) {
    super(appState);
    this.appState = appState;
    this.host = host;
    this.host.addController(this);
    this.constructor.subscribers.push(host);
    Object.defineProperty(this.host, 'list', {
      get: () => {
        return this.appState.list(this.modelName);
        
      },
      // TODO: create list.by_*dynamic_field*("teste") like list.by_tag("LLaMa")
      set: (id, newList) => {
        // Set logic
        this.appState.set(this.modelName, newList);
        this.notify(this.modelName, newList);
        
        // Request an update to the LitElement component
        if (this.host instanceof LitElement) {
          this.host.requestUpdate();
        }
      },
    });
    
  }
  
  
  generateId() {
    let id = "";
    const charSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"; // 64 chars
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      id += charSet[randomIndex];
    }
    return id;
  }

  add = (record) => {
    const id = this.generateId();
    this.appState.add(id, record);
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