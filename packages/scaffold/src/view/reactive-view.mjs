import { LitElement, html } from "lit";
import { until } from "lit/directives/until.js";
import { customElement } from "lit/decorators.js";
import i18n from "../plugins/i18n/i18n.mjs";
import url from "../model/adapters/url.mjs";
import CRUD from "../helpers/rest.mjs";
import DateTimeHelpers from "../helpers/datetime.mjs";
import StringHelpers from "../helpers/string.mjs";

const syncAdapters = { url, localStorage, sessionStorage };

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
  
  const { style } = config;
  class ReactionView extends LitElement {
    // Define the properties for LitElement
    static properties = Object.keys(props)
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
      this.context = { html, until, i18n: i18n(props.i18n), ...CRUD, ...DateTimeHelpers, ...StringHelpers };
      
      const propKeys = Object.keys(props);
      propKeys.forEach((key)=> {
        const prop = props[key];
        if(prop.defaultValue) {
          this[key] = prop.defaultValue;
        }
        
        if(prop.sync) {
          this[key] = syncAdapters[prop.sync].getItem(key); // you might have added a sync adapter that doesn't exist
        }

        if(!prop.readonly) {
          const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
          this[setterName] = (newValue) => {
            //if(model?.properties[key]) {
            // TODO: do a few things only if it is a connected-to-model property
            //}
            if(prop.sync) {              
              syncAdapters[prop.sync].setItem(key, newValue);
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
    }
  
    firstUpdated() {
      onLoad?.(this);
    }
  
    render() {
      
      return component.template || render?.(this, this.context) || html`<h1>Error: no render function or template.</h1>`;
    }
  }

  ReactionView.styles = style ? [style] : undefined;
  ReactionView.props = props;
  
  // Register the custom element
  customElement(tag)(ReactionView);
  
  return ReactionView;
}


export const defineViews = (views, { style }) => {
  return Object.fromEntries(
    Object.entries(views).map(([name, view]) => {
      return [
        name,
        defineView(view, {
          style,
        }),
      ];
    })
  );
};