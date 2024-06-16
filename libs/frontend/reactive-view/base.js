import { LitElement } from "helpers";
import {
  defineSyncProperty
} from "./sync.js";
let _tailwindBase;

export const UnoTheme = {};

export const addThemeClasses = ({ tag, _theme: theme } = {}) => {
  if (!theme) return;
  
  Object.entries(theme).forEach(([key, value = ""]) => {
    if (typeof value !== "string") return;

    if (key.startsWith('.')) {
      UnoTheme[key.substring(1)] = value;
    } else {
      const classes = !key ? value : value.split(' ').map(className => `${key}:${className}`).join(" ");
      UnoTheme[tag] = UnoTheme[tag] ? `${UnoTheme[tag]} ${classes}` : classes;
    }
  });
};

class ReactiveView extends LitElement {
    static _Components = {};
    constructor({ component }) {
      super(); 
      Object.assign(this, component);
      this.setupProperties(component.props);
      
      if(this.tag) this.classList.add(this.tag);
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
    
    static define(tag, component, globalStyle) {
        if (!tag)
          console.error(`Error: component doesn't have a tag property`);
          
      
        if (!_tailwindBase) {
          _tailwindBase = new CSSStyleSheet();
          _tailwindBase.replaceSync(globalStyle);
        }
      
        component.styles = [
          _tailwindBase,
          ...(Array.isArray(component.style) ? component.style : [component.style]),
        ].filter(Boolean);      
      }
      
      static install() {
        console.log(window.__unocss_runtime);
        Object.keys(_Components).forEach(tag => customElements.define(tag, this._Components[tag]));
        
      }
  }

  export default ReactiveView;