import { LitElement, html } from "lit";
import { until } from "lit/directives/until.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { customElement } from "lit/decorators.js";
import I18N from "./helpers/i18n/i18n.mjs";
import url from "./helpers/url.mjs";
import CRUD from "./helpers/rest.mjs";
import DateTimeHelpers from "./helpers/datetime.mjs";
import StringHelpers from "./helpers/string.mjs";

const isServer = typeof localStorage === "undefined";

const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };

const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  array: Array
};

const checkType = (value) => {
  const type = Array.isArray(value) ? "array" : typeof value;
  if (type === "object" && value !== null && "type" in value) {
    return value.type;
  }
  return type === TYPE_MAP[type] || String;
};

/**
 * Defines and registers a custom element based on the provided configuration.
 *
 * @param {Object} component - The configuration object for the custom element.
 * @param {Object} [config={}] - Additional configuration parameters.
 * @returns {typeof LitElement}
 */

export function defineView(tag, component, config = {}) {
  const {
    render,
    firstUpdated,
    init: componentInit,
    formAssociated,
    props,
    ...litPropsAndEvents
  } = component;

  const { style, i18n } = config;

  // Map the new props format to the structure used in the original code
  const properties = !props
    ? {}
    : Object.keys(props).reduce((acc, key) => {
      const value = props[key];
      acc[key] = {
        type: checkType(value),
        defaultValue: value
      };
      if (value.type) {
        // If the user supply an object like {type: String, key: "propKey", sync: "url"} we add those values to the prop so it can be used later
        acc[key] = { ...acc[key], ...value };
      }
      return acc;
    }, {});

  class ReactionView extends LitElement {
    static properties = properties;
    static formAssociated = formAssociated;
    constructor() {
      super();
      componentInit?.(this);
      this.context = {
        html,
        until,
        ifDefined,
        repeat,
        i18n: I18N(i18n),
        ...CRUD,
        ...DateTimeHelpers,
        ...StringHelpers
      };

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

    disconnectedCallback() {
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

    firstUpdated() {
      firstUpdated?.(this);
    }

    render() {
      return (
        render?.(this, this.context) ||
        html`<h1>Error: no render function or template.</h1>`
      );
    }
  }

  Object.keys(litPropsAndEvents)
    .filter((method) => method[0] !== "_")
    .forEach((method) => {
      ReactionView.prototype[method] = litPropsAndEvents[method];
    });

  ReactionView.styles = style ? [style] : undefined;
  ReactionView.props = properties;

  // Register the custom element
  customElement(tag)(ReactionView);

  return ReactionView;
}

export const defineViews = (views, { style, i18n }) => {
  return Object.fromEntries(
    Object.entries(views).map(([tag, component]) => {
      return [
        tag,
        defineView(tag, component, {
          style,
          i18n
        })
      ];
    })
  );
};
