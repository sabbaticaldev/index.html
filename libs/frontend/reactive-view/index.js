import { i18n, LitElement, TYPE_MAP } from "helpers";

import { defineSyncProperty, syncKeyMap } from "./sync.js";
import { getElementTheme } from "./theme.js";

let activeEffect = null;
const effectStack = [];

export const instances = [];
class ReactiveView extends LitElement {
  i18n = i18n;
  static formAssociated;
  static _instancesUsingSync = syncKeyMap;

  constructor({ component }) {
    super();
    instances.push(this);
    this.component = component;
    this._queryCache = {};
    this.effects = new Map();

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
      this.defineReactiveProperty(key, prop);
      if (prop.sync) defineSyncProperty(this, key, prop);
    });
  }

  defineReactiveProperty(key, prop) {
    let value = prop.defaultValue;
    const effects = new Set();

    const triggerEffects = () => {
      effects.forEach((effect) => effect());
      this.requestUpdate();
    };

    const proxyHandler = {
      get(target, prop) {
        if (typeof target[prop] === "object" && target[prop] !== null) {
          return new Proxy(target[prop], proxyHandler);
        }
        return target[prop];
      },
      set(target, prop, newValue) {
        if (target[prop] !== newValue) {
          target[prop] = newValue;
          triggerEffects();
        }
        return true;
      },
    };

    if (typeof value === "object" && value !== null) {
      value = new Proxy(value, proxyHandler);
    }

    Object.defineProperty(this, key, {
      get: () => {
        if (activeEffect) {
          effects.add(activeEffect);
          this.effects.set(key, effects);
        }
        return value;
      },
      set: (newValue) => {
        if (value !== newValue) {
          if (typeof newValue === "object" && newValue !== null) {
            newValue = new Proxy(newValue, proxyHandler);
          }
          value = newValue;
          triggerEffects();
        }
      },
      configurable: true,
    });

    if (!prop.readonly) {
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      this[setterName] = (newValue) => {
        this[key] = newValue;
      };
    }
  }

  createEffect(effect) {
    const wrappedEffect = () => {
      activeEffect = wrappedEffect;
      effectStack.push(activeEffect);
      try {
        effect();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    };
    wrappedEffect();
  }

  q(element) {
    return (this._queryCache[element] ||=
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
