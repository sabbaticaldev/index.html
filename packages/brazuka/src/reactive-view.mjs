import { LitElement } from "lit";
import { url } from "brazuka-helpers";
import i18n from "./helpers/i18n.mjs";

const isServer = typeof localStorage === "undefined";

const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };

/**
 * Defines and registers a custom element based on the provided configuration.
 *
 * @param {Object} component - The configuration object for the custom element.
 * @param {Object} [config={}] - Additional configuration parameters.
 * @returns {typeof LitElement}
 */

const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  date: Date,
  array: Array
};

export function defineView(tag, component, config = {}) {
  const {
    render,
    init: componentInit,
    formAssociated,
    style: styleProp,
    props,
    domReady,
    domDisconnect,
    ...litPropsAndEvents
  } = component;

  const { style } = config;

  const properties = props || {};
  class ReactionView extends LitElement {
    static properties = !props
      ? {}
      : Object.keys(props).reduce((acc, key) => {
        const value = props[key];
        acc[key] = {
          ...value,
          type: TYPE_MAP[value.type] || TYPE_MAP["string"]
        };
        return acc;
      }, {});

    i18n = i18n;
    static formAssociated = formAssociated;
    constructor() {
      super();
      componentInit?.(this);
      Object.keys(litPropsAndEvents)
        .filter((method) => method[0] === "_")
        .forEach((method) => {
          this[method] = litPropsAndEvents[method];
        });

      const propKeys = Object.keys(properties);
      propKeys.forEach((key) => {
        const prop = properties[key];
        if (prop.defaultValue) {
          this[key] = prop.defaultValue;
        }

        if (prop.sync) {
          this[key] = syncAdapters[prop.sync].getItem(prop.key || key); // you might have added a sync adapter that doesn't exist
        }

        if (!prop.readonly) {
          const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
          this[setterName] = (newValue) => {
            //if(model?.properties[key]) {
            // TODO: do a few things only if it is a connected-to-model property
            //}
            if (prop.sync) {
              syncAdapters[prop.sync].setItem(prop.key || key, newValue);
            }
            this[key] = newValue;
          };
        }
      });

      if (typeof window !== "undefined") {
        this.boundServiceWorkerMessageHandler =
          this.handleServiceWorkerMessage.bind(this);
        navigator.serviceWorker.addEventListener(
          "message",
          this.boundServiceWorkerMessageHandler
        );
      }
    }

    // Handler for service worker messages
    handleServiceWorkerMessage(event) {
      if (event.data === "REQUEST_UPDATE") {
        // TODO: it should update only the specific element, not all elements - prototype
        // one way to implement is to store all IDs used by this component and have a event.data.updatedIds to match
        this.requestUpdate();
      }
    }

    connectedCallback() {
      if (domReady) {
        domReady(this);
      }
      if (this instanceof LitElement) {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      if (domDisconnect) {
        domDisconnect(this);
      }
      if (this instanceof LitElement) {
        super.disconnectedCallback();
      }
      if (typeof window !== "undefined") {
        navigator.serviceWorker.removeEventListener(
          "message",
          this.boundServiceWorkerMessageHandler
        );
      }
    }

    render() {
      return render?.(this, this.context);
    }
  }

  Object.keys(litPropsAndEvents)
    .filter((method) => method[0] !== "_")
    .forEach((method) => {
      ReactionView.prototype[method] = litPropsAndEvents[method];
    });

  ReactionView.styles = [style, styleProp].filter(Boolean);

  // Register the custom element
  customElements.define(tag, ReactionView);

  return ReactionView;
}

export const definePackage = (pkg, { style }) => {
  const views = Object.fromEntries(
    Object.entries(pkg.views).map(([tag, component]) => {
      return [
        tag,
        defineView(tag, component, {
          style
        })
      ];
    })
  );
  return { views, models: pkg.models, controllers: pkg.controllers };
};
