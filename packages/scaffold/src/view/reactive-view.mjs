import { LitElement, html } from "lit";
import { until } from "lit/directives/until.js";
import { customElement } from "lit/decorators.js";
import i18n from "../plugins/i18n/i18n.mjs";
import url from "../model/adapters/url.mjs";

function dispatchEvent(key, params = {}) {
  const event = {
    type: key,
    params
  };  
  // Send this event to the service worker for processing
  if (typeof window !== "undefined" && navigator?.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage(event);
  }
}

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
export function defineView(component, config = {}) {
  // Destructure properties from the component configuration
  const {
    tag,
    props = {},
    render,
    onLoad,
  } = component;
  
  const { controller: ControllerClass, model = {}, style } = config;
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
      
      if (ControllerClass) {
        this.controller = new ControllerClass(this, model);
        this.event = dispatchEvent;
      }
      
      let mergedProps = props;
      if(this.reactive && model?.properties) {
        mergedProps = { ...props, ...(model?.properties || {}) };
      }
      
      const propKeys = Object.keys(mergedProps);
      propKeys.filter(filterActionControllerProps).forEach((key)=> {
        const prop = mergedProps[key];
        if(prop.defaultValue) {
          this[key] = prop.defaultValue;
        }

        if(prop.url) {          
          this[key] = url.getItem(key);
          console.log(prop.url, this[key], key);
        }

        if(!prop.readonly) {
          const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
          this[setterName] = (newValue) => {
            //if(model?.properties[key]) {
            // TODO: do a few things only if it is a connected-to-model property
            //}
            if(props.url) {
              url.setItem(key, newValue);
            }
            this[key] = newValue;            
          };
        }
      });
    
      if(typeof window !== "undefined") {
        this.boundServiceWorkerMessageHandler = this.handleServiceWorkerMessage.bind(this);
        navigator.serviceWorker.addEventListener("message", this.boundServiceWorkerMessageHandler);
      }
    }

    // Handler for service worker messages
    handleServiceWorkerMessage(event) {
      if (event.data === "REQUEST_UPDATE") {
        // TODO: it should update only the specific element, not all elements - prototype 
        this.requestUpdate();
      }
    }

    disconnectedCallback() {
      if (this instanceof LitElement) {
        super.disconnectedCallback();
      }
      if(typeof window !== "undefined") {
        navigator.serviceWorker.removeEventListener("message", this.boundServiceWorkerMessageHandler);
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


export const defineViews = (views, { controllers, models, style }) => {
  return Object.fromEntries(
    Object.entries(views).map(([name, view]) => {
      const controllerName = view.controller || name;
      const modelName = view.model || controllerName;
      return [
        name,
        defineView(view, {
          model: models[modelName],
          style,
          controller: controllers[controllerName],
        }),
      ];
    })
  );
};