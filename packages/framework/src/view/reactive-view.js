import { LitElement, html } from "lit";
import { until } from "lit/directives/until.js";
import { customElement } from "lit/decorators.js";
import i18n from "../plugins/i18n/i18n.js";


function jQuery(selector) {
  const elements = document.querySelectorAll(selector);
  return {
    on: (eventName, callback) => {
      elements.forEach(el => el.addEventListener(eventName, callback));
      return this;
    },
    off: (eventName, callback) => {
      elements.forEach(el => el.removeEventListener(eventName, callback));
      return this;
    },
    attr: (attribute, value) => {
      if (typeof value === "undefined") {
        return elements[0].getAttribute(attribute);
      } else {
        elements.forEach(el => el.setAttribute(attribute, value));
        return this;
      }
    }
  };
}

/**
 * Defines and registers a custom element based on the provided configuration.
 *
 * @param {Object} component - The configuration object for the custom element.
 * @param {Object} [config={}] - Additional configuration parameters.
 * @returns {typeof LitElement}
 */
export default function defineView(component, config = {}) {
  // Destructure properties from the component configuration
  const {
    controller,
    tag,
    
    props = {},
    render,
    onLoad,
  } = component;
  
  const { controllers = {}, appState, style } = config;
  const filterActionControllerProps = (key) => !(["list", "record"].includes(key)); // this property is managed by the Action Controller

  class ReactionView extends LitElement {
    // Define the properties for LitElement
    static properties = Object.keys(props)
      .filter(filterActionControllerProps)
      .reduce((acc, key) => {
        const prop = props[key];
        acc[key] = {
          type: prop.type,
          noAccessor: !!prop.readonly,
          defaultValue: prop.defaultValue,
        };
        return acc;
      }, {});
  
    constructor() {
      super();
      this.html = html;
      this.until = until;
      if(props.i18n) {
        this.i18n = i18n(props.i18n);
      }
      this.reactive = !!(props.list || props.record);
      const ControllerClass = controller && controllers[controller];
      if (ControllerClass) {
        this.controller = new ControllerClass(this, appState);
        this.event = this.controller.dispatchEvent.bind(this.controller);        
      }

      const propKeys = Object.keys(props);
      const stateKeys = propKeys.filter(key => !props[key].readonly);      
      stateKeys.filter(filterActionControllerProps).forEach((key)=> {        
        if(props[key].defaultValue) {
          this[key] = props[key].defaultValue;
        }
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        this[setterName] = (newValue) => {
          this[key] = newValue;          
        };
      });
    }
  
    disconnectedCallback() {
      if (this instanceof LitElement) {
        super.disconnectedCallback();
      }
      if(this.controller && this.controller.subscriptionCallbacks?.length > 0) {
        for (const key of Object.keys(this.controller.subscriptionCallbacks)) {
          this.controller.unsubscribe(key);
        }
      }
    }
  
    firstUpdated() {
      onLoad?.(this);
    }
  
    render() {
      this.$ = jQuery; // injects $ as document.querySelectorAll into the component's render() - jQuery is cool again 😎
      return component.template || render?.(this, this.controller) || html`<h1>Error: no render function or template.</h1>`;
    }
  }
  
  ReactionView.styles = style ? [style] : undefined;
  ReactionView.props = props;
  
  // Register the custom element
  customElement(tag)(ReactionView);
  
  return ReactionView;
}