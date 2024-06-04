import { i18n, LitElement, TYPE_MAP } from "helpers";

import {
  defineSyncProperty,
  requestUpdateOnUrlChange,
  syncKeyMap,
} from "./sync.js";
import { getElementTheme } from "./theme.js";
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
        this.boundServiceWorkerMessageHandler,
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
      Object.keys(props).map((prop) => [prop, this[prop]]),
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
  // TODO: cache default theme so same elements dont need to create same theme
  updated() {
    super.updated();

    const themedElements = this.shadowRoot.querySelectorAll("[data-theme]");
    const props = this.getProps();

    const applyClasses = (elementTheme, el, keepOldClasses) => {
      if (elementTheme && typeof elementTheme === "string") {
        const classes = elementTheme.split(" ").filter(Boolean);
        if (classes?.length) {
          if (!keepOldClasses) el.className = "";
          el.classList.add(...classes);
        }
      }
    };

    const applyTheme = (el, themeClassKey) => {
      const dataProps = Object.fromEntries(
        Array.from(el.attributes)
          .filter(
            (attr) =>
              attr.name.startsWith("data-") && attr.name !== "data-theme",
          )
          .map((attr) => [attr.name.replace("data-", ""), attr.value || true]),
      );
      const elementTheme = getElementTheme(themeClassKey, {
        ...dataProps,
        ...props,
      });

      if (elementTheme) applyClasses(elementTheme, el);
    };

    themedElements.forEach((el) => {
      const themeClassKey = el.getAttribute("data-theme");
      applyTheme(el, themeClassKey);
    });

    const mainElementTheme = getElementTheme(this.component.tag, props);
    if (mainElementTheme) applyClasses(mainElementTheme, this, true);
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
    i18n = i18n;
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
    Object.keys(pkg.views).map((key) =>
      defineView({ key, component: pkg.views[key], style }),
    ),
  );
  return { ...pkg, views };
};

export default ReactiveView;
