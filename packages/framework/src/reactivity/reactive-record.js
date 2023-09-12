import Storage from "../mvc/storage-controller";

/**
 * Class representing an active record.
 */
class ReactiveRecord {
  /**
   * @param {Object} [initialState={}]
   * @param {Object} [config={}]
   */
  
  constructor({ data, name, adapter } = {}) {    
    this.name = name;
    const store = adapter && Storage[adapter] || Storage["memory"];
    this.state = new store(name);
    
    // Load initial state from storage
    for (const key in data) {
      const obj = data[key];
      const id = obj.id || key;
      const storedValue = this.state.get(id);
      console.log(this.state);
      if (storedValue === null || storedValue === undefined) {
        this.state.add(id, data[key]);   
      }
    }
  }

  /**
   * Dispatch an event. The event handlers are responsible for updating the state.
   * @param {string} event 
   * @param {*} [data]
   */
  dispatch(event, data) {
    if (this.eventHandlers[event]) {
      for (const handler of this.eventHandlers[event]) {
        handler(data);
      }
    }
  }

  /**
   * Used to set a state value and notify subscribers.
   * @param {string} key 
   * @param {*} value 
   */
  add(key, value) {
    if(typeof window !== "undefined") {
      this.state.add(key, {...value, id: key});      
    }
  }

  /**
   * Used to set a state value and notify subscribers.
   * @param {string} key 
   * @param {*} value 
   */
  edit(key, value) {
    this.state.edit(key, value);      
  }

  remove(key) {
    this.state.remove(key);      
  }

  get(key) {
    return this.state.get(key);
  }

  list() {
    return this.state.list(this.name+"list");
  }
}

export default ReactiveRecord;