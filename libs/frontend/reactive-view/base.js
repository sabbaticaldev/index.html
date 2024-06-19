import { LitElement } from "lit";

import events from "../events.js";
import reset from "../reset.txt";
import unoRuntime from "../unocss/unocss.runtime.js";
import { defineSyncProperty, requestUpdateOnUrlChange } from "./sync.js";
window.addEventListener("popstate", requestUpdateOnUrlChange);
const resetCss = new CSSStyleSheet();
resetCss.replaceSync(reset);

export let UnoTheme = {};
let _Components = {};

class ReactiveView extends LitElement {
  // TODO: storing instances of ReactiveView should be optional
  static instances = new Set();
  events = events;
  constructor() {
    super();
    this.setupProperties(this.constructor.properties);
    this.classList.add(this.constructor.tag);
    ReactiveView.instances.add(this);

    if (typeof window !== "undefined") {
      this.boundServiceWorkerMessageHandler =
        this.handleServiceWorkerMessage.bind(this);
      navigator.serviceWorker.addEventListener(
        "message",
        this.boundServiceWorkerMessageHandler,
      );
    }
  }

  // Handler for service worker messages
  handleServiceWorkerMessage(event) {
    const { type, ...data } = event.data || {};
    const key = type || event.data;
    if (key && this.events[key]) {
      const params = {
        source: event.source,
        instance: this,
        P2P: {},
      };
      const fn = this.events[key];
      fn.bind(this);
      fn(data, params);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ReactiveView.instances.delete(this);
  }

  static unoRuntime() {
    return unoRuntime(UnoTheme);
  }

  getProps(_props) {
    const props = _props || this.props;
    if (!props) return;
    return Object.fromEntries(
      Object.keys(props).map((prop) => [prop, this[prop]]),
    );
  }

  setupProperties(props) {
    Object.entries(props || {}).forEach(([key, prop]) => {
      if (prop.sync) defineSyncProperty(this, key, prop);
      else if (prop.defaultValue) {
        this[key] = prop.defaultValue;
      }
    });
  }

  q(element) {
    return this.shadowRoot.querySelector(element);
  }

  qa(element) {
    return this.shadowRoot.querySelectorAll(element);
  }
  qaSlot({ tag, slot: namedSlot } = {}) {
    const slot = namedSlot
      ? this.q(`slot[name="${namedSlot}"]`)
      : this.q("slot");
    const nodes = slot ? slot.assignedElements({ flatten: true }) : [];
    return tag
      ? nodes.filter((node) => node.tagName.toLowerCase() === tag.toLowerCase())
      : nodes;
  }

  updateStyles(stylesheet) {
    this.shadowRoot.adoptedStyleSheets = [stylesheet];
    this.requestUpdate();
  }

  static define(tag, component) {
    if (_Components[tag]) return;
    _Components[tag] = component;
    if (component.theme)
      ReactiveView.addThemeClasses({ tag, theme: component.theme });
    return component;
  }

  static async generateCss() {
    const { css } = await window.__unocss_runtime.uno.generate(
      Object.keys(UnoTheme),
      {
        preflights: false,
      },
    );
    return css;
  }

  static async install(updateAllInstances = false) {
    const css = await ReactiveView.generateCss();
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync([reset, css].join(" "));
    Object.keys(_Components).forEach(async (tag) => {
      const component = _Components[tag];
      if (!component) return;
      component.tag = tag;
      component.styles = [stylesheet];
      if (!customElements.get(tag)) customElements.define(tag, component);
    });

    if (updateAllInstances) {
      ReactiveView.instances.forEach((instance) => {
        instance.updateStyles(stylesheet);
      });
    }
  }

  static addThemeClasses = ({ tag, theme } = {}) => {
    if (!theme) return;
    Object.entries(theme).forEach(([key, value = ""]) => {
      if (typeof value !== "string") return;

      if (key.startsWith(".")) {
        UnoTheme[key.substring(1)] = value;
      } else {
        const classes = !key
          ? value
          : value
              .split(" ")
              .map((className) => `${key}:${className}`)
              .join(" ");
        UnoTheme[tag] = UnoTheme[tag] ? `${UnoTheme[tag]} ${classes}` : classes;
      }
    });
  };
}

export default ReactiveView;
