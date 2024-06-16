import { LitElement } from "helpers";
import {
  defineSyncProperty
} from "./sync.js";

class ReactiveView extends LitElement {
    constructor({ component }) {
      super(); 
      Object.assign(this, component);
      this.setupProperties(component.props);
    }
  
    getProps(_props) {
      const props = _props || this.props;
      if (!props) return;
      return Object.fromEntries(
        Object.keys(props).map((prop) => [prop, this[prop]])
      );
    }
    setupProperties(props) {
      Object.entries(props || {}).forEach((([key, prop]) => {
        if (prop.defaultValue) {
          this[key] = prop.defaultValue;
        }
        if (prop.sync) defineSyncProperty(this, key, prop);
      }));
    }
    q(element) {
      return this.shadowRoot.querySelector(element);
    }
    qa(element) {
      return this.shadowRoot.querySelectorAll(element);
    }
    qaSlot(tagName) {
      const slot = this.q('slot');
      const nodes = slot.assignedElements({ flatten: true });
      return tagName ? nodes.filter(node => node.tagName.toLowerCase() === tagName.toLowerCase()) : nodes;
    }
  }

  export default ReactiveView;