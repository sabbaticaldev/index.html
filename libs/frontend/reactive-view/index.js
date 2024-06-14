import { i18n, LitElement, TYPE_MAP } from "helpers";
import {
  defineSyncProperty,
  requestUpdateOnUrlChange,
  syncKeyMap,
} from "./sync.js";

import appKit from "../uix/app/package.js";
import chatKit from "../uix/chat/package.js";
import contentKit from "../uix/content/package.js";
import crudKit from "../uix/crud/package.js";
import datetimeKit from "../uix/datetime/package.js";
import docsKit from "../uix/docs/package.js";
import formKit from "../uix/form/package.js";
import layoutKit from "../uix/layout/package.js";
import navigationKit from "../uix/navigation/package.js";
import pageKit from "../uix/page/package.js";

export const UnoTheme = {};

const addThemeClasses = ({ tag, _theme: theme } = {}) => {
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

export const loadFrontendFiles = (app) => {
  const packages = {
    app,
    appKit,
    chatKit,
    contentKit,
    crudKit,
    pageKit,
    datetimeKit,
    docsKit,
    formKit,
    layoutKit,
    navigationKit,
  };

  const loadedPackages = Object.values(packages).flatMap(pkg => Object.values(pkg.views));

  loadedPackages.forEach(component => {
    if (component && component.tag && component._theme) {
      addThemeClasses(component);
    }
  });
  return loadedPackages;
};


window.addEventListener("popstate", requestUpdateOnUrlChange);
export const instances = [];

class ReactiveView extends LitElement {
  static _instancesUsingSync = syncKeyMap;
  constructor({ component }) {
    super();
    instances.push(this);
    this.component = component;
    this._queryCache = {};
    this.initializeComponent(component);
    this.setupProperties(component.props);
    this.setupMessageHandler();
  }

  setupMessageHandler() {
    if (typeof window !== "undefined") {
      this.boundServiceWorkerMessageHandler =
        this.handleServiceWorkerMessage.bind(this);
      navigator.serviceWorker.addEventListener(
        "message",
        this.boundServiceWorkerMessageHandler
      );
    }
  }
  handleServiceWorkerMessage(event) {
    if (event.data === "REQUEST_UPDATE") {
      this.requestUpdate();
    }
  }
  getProps(_props) {
    const props = _props || this.component.props;
    if (!props) return;
    return Object.fromEntries(
      Object.keys(props).map((prop) => [prop, this[prop]])
    );
  }
  initializeComponent(component) {
    const { init: componentInit, ...litPropsAndEvents } = component;
    componentInit?.(this);
    Object.assign(this, litPropsAndEvents);
  }
  setupProperties(props) {
    Object.entries(props || {}).forEach(([key, prop]) => {
      if (prop.defaultValue) {
        this[key] = prop.defaultValue;
      }
      if (!prop.readonly) {
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        this[setterName] = (newValue) => {
          this[key] = newValue;
        };
      }
      if (prop.sync) defineSyncProperty(this, key, prop);
    });
  }
  q(element) {
    return (this._queryCache[element] ??=
      this.shadowRoot.querySelector(element));
  }
  qa(element) {
    return this.shadowRoot.querySelectorAll(element);
  }
  connectedCallback() {
    super.connectedCallback();
    this.component.connectedCallback?.bind(this)();
  }

  disconnectedCallback() {
    this.component.disconnectedCallback?.bind(this)();
    ReactiveView._instancesUsingSync.forEach((instances) =>
      instances.delete(this)
    );
    super.disconnectedCallback();
    if (typeof window !== "undefined") {
      navigator.serviceWorker.removeEventListener(
        "message",
        this.boundServiceWorkerMessageHandler
      );
    }
  }
}

let _tailwindBase;
const getProperties = (props) =>
  Object.keys(props || {}).reduce((acc, key) => {
    const value = props[key];
    acc[key] = { ...value, type: TYPE_MAP[value.type] || TYPE_MAP.string };
    return acc;
  }, {});

export function defineView({ key, component, style: globalStyle }) {
  const tag = component.tag;
  if (!tag)
    console.error(`Error: component ${key} doesn't have a tag property`);
  class View extends ReactiveView {
    i18n = i18n;
    static formAssociated = component.formAssociated;
    static properties = getProperties(component.props);
    constructor() {
      super({ component });
      this.classList.add(tag);
    }
  }

  if (!_tailwindBase) {
    _tailwindBase = new CSSStyleSheet();
    _tailwindBase.replaceSync(globalStyle);
  }

  View.styles = [
    _tailwindBase,
    ...(Array.isArray(component.style) ? component.style : [component.style]),
  ].filter(Boolean);

  customElements.define(tag, View);
  return [tag, View];
}

export default ReactiveView;
