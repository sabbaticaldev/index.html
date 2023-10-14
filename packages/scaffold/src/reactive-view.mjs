import { LitElement, html } from "lit";
import { until } from "lit/directives/until.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { keyed } from "lit/directives/keyed.js";
import { repeat } from "lit/directives/repeat.js";
import { customElement } from "lit/decorators.js";
import CRUD from "./helpers/rest.mjs";
import DateTimeHelpers from "./helpers/datetime.mjs";
import i18n from "./helpers/i18n/i18n.mjs";
import url from "./helpers/url.mjs";
import DropareaHelpers from "./helpers/droparea.mjs";
import { WebWorker } from "backend/src/web-worker.mjs";
const isServer = typeof localStorage === "undefined";

const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };

export const T = {
  boolean: (options = {}) => ({
    type: "boolean",
    defaultValue: options.defaultValue ?? false,
    ...options
  }),

  string: (options = {}) => ({
    type: "string",
    defaultValue: options.defaultValue || "",
    enum: options.enum || [],
    ...options
  }),

  array: (options = {}) => ({
    type: "array",
    defaultValue: options.defaultValue || [],
    enum: options.enum || [],
    ...options
  }),

  number: (options = {}) => ({
    type: "number",
    defaultValue: options.defaultValue || undefined,
    ...options
  }),

  date: (options = {}) => ({
    type: "date",
    defaultValue: options.defaultValue || undefined,
    ...options
  }),

  function: (options = {}) => ({
    type: "function",
    defaultValue: options.defaultValue || undefined,
    ...options
  }),

  object: (options = {}) => ({
    type: "object",
    defaultValue: options.defaultValue || undefined,
    ...options
  }),
  one: (relationship, targetForeignKey, options = {}) => ({
    type: "one",
    relationship,
    targetForeignKey: targetForeignKey,
    ...options
  }),
  many: (relationship, targetForeignKey, options = {}) => ({
    type: "many",
    relationship,
    targetForeignKey: targetForeignKey,
    ...options
  })
};

export const F = {
  text: (options = {}) => ({
    formType: "text",
    type: T.string(options)
  }),

  number: (options = {}) => ({
    formType: "number",
    type: T.number(options)
  }),

  date: (options = {}) => ({
    formType: "date",
    type: T.date(options)
  }),

  datetime: (options = {}) => ({
    formType: "datetime",
    type: T.string(options)
  }),

  time: (options = {}) => ({
    formType: "time",
    type: T.string(options)
  }),

  checkbox: (options = {}) => ({
    formType: "checkbox",
    type: T.boolean(options)
  }),

  radio: (options = {}) => ({
    formType: "radio",
    type: T.boolean(options)
  }),

  toggle: (options = {}) => ({
    formType: "toggle",
    type: T.boolean(options)
  }),

  richText: (options = {}) => ({
    formType: "richText",
    type: T.string(options)
  }),

  custom: (customFormType, options) => ({
    customFormType,
    type: T[customFormType](options)
  })
};

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
    firstUpdated,
    init: componentInit,
    formAssociated,
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

  // Register the custom element
  customElement(tag)(ReactionView);

  return ReactionView;
}

export const definePackage = (packageFn, { style }) => {
  const context = {
    T,
    F,
    html,
    until,
    ifDefined,
    repeat,
    keyed,
    i18n,
    ...CRUD,
    ...DateTimeHelpers,
    ...DropareaHelpers,
    WebWorker
  };
  const pkg = packageFn(context);
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
