import idbAdapter from "../indexeddb/index.js";
import { CrudReactiveRecord } from "./crud.js";

class ReactiveRecord extends CrudReactiveRecord {
  constructor({ _init, ...properties }, { name, store }) {
    super();
    this.name = name;
    this.adapter = idbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    this.store = store;
    if (_init) _init(this);
  }

  async isEmpty() {
    return this.adapter.isEmpty(this.store);
  }
}

export { ReactiveRecord };
