import { i18n, stringToType, url } from "helpers";
import { LitElement } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { getElementTheme, updateTheme } from "./theme.js";

const isServer = typeof localStorage === "undefined";
const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };
export const instances = [];

const syncKeyMap = new Map();

const defineSyncProperty = (instance, key, prop) => {
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
      if (!prop.readonly) {
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        this[setterName] = (newValue) => {
          this[key] = newValue;
        };
      }
      if (prop.sync) defineSyncProperty(this, key, prop);
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


const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  date: Date,
  array: Array,
};

let _tailwindBase;
const getProperties = (props) => 
  Object.keys(props || {}).reduce((acc, key) => {
    const value = props[key];
    acc[key] = { ...value, type: TYPE_MAP[value.type] || TYPE_MAP.string };
    return acc;
  }, {});

export function defineView({ tag, component, style }) {
  class ReactiveView extends BaseReactiveView {
    static formAssociated = component.formAssociated;
    static properties = getProperties(component.props);
    constructor() {
      super({ component });
    }
  }

  if (!_tailwindBase) {
    _tailwindBase = new CSSStyleSheet();
    _tailwindBase.replaceSync(style);
  }

  ReactiveView.styles = [_tailwindBase, ...Array.isArray(component.style) ? component.style : []].filter(Boolean);

  customElements.define(tag, ReactiveView);
  return ReactiveView;
}

export const definePackage = ({ pkg, style }) => {
  const views = Object.fromEntries(
    Object.entries(pkg.views).map(([tag, component]) => [tag, defineView({ tag, component, style })])
  );
  return { views, models: pkg.models, controllers: pkg.controllers };
};
export default BaseReactiveView;
