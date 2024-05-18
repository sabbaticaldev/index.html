import i18n from "helpers/i18n.js";
import { stringToType } from "helpers/types.js";
import url from "helpers/url.js";
import { LitElement } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { getElementTheme, updateTheme } from "./theme.js";

const isServer = typeof localStorage === "undefined";
const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };
export const instances = [];

const syncKeyMap = new Map();

const defineReactiveProperty = (instance, key, prop) => {
  const syncKey = { key, sync: prop.sync };
  const getValue = () => {
    const value = syncAdapters[prop.sync].getItem(prop.key || key);
    return value ? stringToType(value, prop) : prop.defaultValue;
  };

  const setValue = (newValue) => {
    if (!prop.readonly) {
      const value = newValue
        ? typeof newValue === "string"
          ? newValue
          : JSON.stringify(newValue)
        : null;
      syncAdapters[prop.sync].setItem(prop.key || key, value);
      instance.requestUpdate(key, instance[key]);
      syncKeyMap.get(syncKey).forEach((inst) => {
        if (inst !== instance) {
          inst.requestUpdate();
        }
      });
    }
  };

  if (!syncKeyMap.has(syncKey)) {
    syncKeyMap.set(syncKey, new Set());
  }
  syncKeyMap.get(syncKey).add(instance);

  Object.defineProperty(instance, key, {
    get: getValue,
    set: setValue,
    configurable: true,
  });

  if (!prop.readonly) {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    instance[setterName] = (newValue) => {
      instance[key] = newValue;
    };
  }
};

class BaseReactiveView extends LitElement {
  i18n = i18n;
  _style;
  _isLoaded;
  _styleElement;
  static updateTheme = updateTheme;
  static formAssociated;
  static _instancesUsingSync = syncKeyMap;

  constructor({ component }) {
    super();
    instances.push(this);
    this.component = component;
    this._queryCache = {};

    const { init: componentInit, props, ...litPropsAndEvents } = this.component;
    componentInit?.(this);

    Object.assign(this, litPropsAndEvents);

    this.generateTheme = (element) => getElementTheme(element, this);

    Object.entries(props || {}).forEach(([key, prop]) => {
      this[key] = prop.defaultValue;
      if (prop.sync) defineReactiveProperty(this, key, prop);
    });

    if (typeof window !== "undefined") {
      this.boundServiceWorkerMessageHandler = this.handleServiceWorkerMessage.bind(this);
      navigator.serviceWorker.addEventListener("message", this.boundServiceWorkerMessageHandler);
    }
  }

  q(element) {
    return this._queryCache[element] ??= this.shadowRoot.querySelector(element);
  }

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
    this.component.connectedCallback?.bind(this)();
    if (this.constructor._style && !this._isLoaded) {
      this._injectStyle();
    }
  }

  disconnectedCallback() {
    this.component.disconnectedCallback?.bind(this)();
    BaseReactiveView._instancesUsingSync.forEach((instances) => instances.delete(this));
    super.disconnectedCallback();
    if (typeof window !== "undefined") {
      navigator.serviceWorker.removeEventListener("message", this.boundServiceWorkerMessageHandler);
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
