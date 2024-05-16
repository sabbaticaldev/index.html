import { LitElement } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { getElementTheme, updateTheme } from "./theme.js";
import i18n from "helpers/i18n.js";
import { stringToType } from "helpers/types.js";
import url from "helpers/url.js";

const isServer = typeof localStorage === "undefined";
const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };
export const instances = [];

class BaseReactiveView extends LitElement {
  i18n = i18n;
  _style;
  _isLoaded;
  _styleElement;
  static updateTheme = updateTheme;
  static formAssociated;
  static _instancesUsingSync = new Map();
  constructor({ component }) {
    super();
    instances.push(this);
    this.component = component;
    this._queryCache = {};
    const {
      style,
      connectedCallback,
      disconnectedCallback,
      init: componentInit,
      props,
      ...litPropsAndEvents
    } = this.component;
    componentInit?.(this);
    Object.keys(litPropsAndEvents).forEach(
      function (method) {
        this[method] = litPropsAndEvents[method];
      }.bind(this),
    );

    this.generateTheme = (element) => getElementTheme(element, this);

    const propKeys = Object.keys(props || {});
    propKeys.forEach((key) => {
      const prop = props[key];
      this[key] = prop.defaultValue;
      const syncKey = { key, sync: prop.sync };
      if (prop.sync) {
        if (!BaseReactiveView._instancesUsingSync.has(syncKey)) {
          BaseReactiveView._instancesUsingSync.set(syncKey, new Set());
        }
        BaseReactiveView._instancesUsingSync.get(syncKey).add(this);

        Object.defineProperty(this, key, {
          get: () => {
            const value = syncAdapters[prop.sync].getItem(prop.key || key);
            return value ? stringToType(value, prop) : prop.defaultValue;
          },
          set: (newValue) => {
            if (!prop.readonly) {
              const value = newValue
                ? typeof newValue === "string"
                  ? newValue
                  : JSON.stringify(newValue)
                : null;
              syncAdapters[prop.sync].setItem(prop.key || key, value);
              this.requestUpdate(key, this[key]);
              BaseReactiveView._instancesUsingSync
                .get(syncKey)
                .forEach((instance) => {
                  if (instance !== this) {
                    instance.requestUpdate();
                  }
                });
            }
          },
          configurable: true,
        });
      }

      if (!prop.readonly) {
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        this[setterName] = (newValue) => {
          this[key] = newValue;
        };
      }
    });

    if (typeof window !== "undefined") {
      this.boundServiceWorkerMessageHandler =
        this.handleServiceWorkerMessage.bind(this);
      navigator.serviceWorker.addEventListener(
        "message",
        this.boundServiceWorkerMessageHandler,
      );
    }
  }

  q(element) {
    if (!this._queryCache[element]) {
      this._queryCache[element] = this.shadowRoot.querySelector(element);
    }
    return this._queryCache[element];
  }

  // Query all matching elements
  qa(element) {
    return this.shadowRoot.querySelectorAll(element);
  }

  handleServiceWorkerMessage(event) {
    if (event.data === "REQUEST_UPDATE") {
      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.component.connectedCallback) {
      this.component.connectedCallback.bind(this)();
    }
    if (this.constructor._style && !this._isLoaded) {
      this._injectStyle();
    }
  }

  disconnectedCallback() {
    if (this.component.disconnectedCallback) {
      this.component.disconnectedCallback.bind(this)();
    }

    BaseReactiveView._instancesUsingSync.forEach((instances) => {
      instances.delete(this);
    });

    super.disconnectedCallback();
    if (typeof window !== "undefined") {
      navigator.serviceWorker.removeEventListener(
        "message",
        this.boundServiceWorkerMessageHandler,
      );
    }
  }

  updateStyles(stylesheet) {
    this.constructor._style = stylesheet;
    this._injectStyle();
  }

  _injectStyle() {
    const styleEl = document.createElement("style");
    styleEl.textContent = this.constructor._style;
    this.shadowRoot.appendChild(styleEl);
    this._styleElement = styleEl;
    this._isLoaded = true;
  }
}

export default BaseReactiveView;
