import { i18n, LitElement, TYPE_MAP } from "helpers";

import { defineSyncProperty, syncKeyMap } from "./sync.js";
import { getElementTheme } from "./theme.js";

export const instances = [];
class ReactiveView extends LitElement {
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
        this.boundServiceWorkerMessageHandler,
      );
    }
  }
  handleServiceWorkerMessage(event) {
    if (event.data === "REQUEST_UPDATE") {
      this.requestUpdate();
    }
  }
  initializeComponent(component) {
    const { init: componentInit, props, ...litPropsAndEvents } = component;
    componentInit?.(this);
    Object.assign(this, litPropsAndEvents);

    this.theme = (element, userProps) =>
      getElementTheme(
        element,
        userProps,
        props &&
          Object.fromEntries(
            Object.keys(props).map((prop) => [prop, this[prop]]),
          ),
      );
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

  updated() {
    const elementTheme = this.theme(this.component.tag);
    if (elementTheme && elementTheme.split) {
      const classes = elementTheme.split(" ").filter((v) => !!v);
      if (classes?.length) this.classList.add(...classes);
    }
  }

  disconnectedCallback() {
    this.component.disconnectedCallback?.bind(this)();
    ReactiveView._instancesUsingSync.forEach((instances) =>
      instances.delete(this),
    );
    super.disconnectedCallback();
    if (typeof window !== "undefined") {
      navigator.serviceWorker.removeEventListener(
        "message",
        this.boundServiceWorkerMessageHandler,
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

export function defineView({ key, component, style }) {
  const tag = component.tag;
  if (!tag)
    console.error(`Error: component ${key} doesn't have a tag property`);
  class View extends ReactiveView {
    i18n = component.i18n;
    static _instancesUsingSync = syncKeyMap;
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
  View.styles = [
    _tailwindBase,
    ...(Array.isArray(component.style) ? component.style : [component.style]),
  ].filter(Boolean);
  customElements.define(tag, View);
  return [tag, View];
}

export const definePackage = ({ pkg, style }) => {
  const views = Object.fromEntries(
    Object.keys(pkg.views).map(
      (key) =>
        !console.log({ key }) &&
        defineView({ key, component: pkg.views[key], style }),
    ),
  );
  return { ...pkg, views };
};

export default ReactiveView;
