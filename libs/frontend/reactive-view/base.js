import { LitElement } from "helpers";

import { defineSyncProperty } from "./sync.js";

export const UnoTheme = {};
const _Components = {};

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
const packages = {
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
class ReactiveView extends LitElement {
  static UnoTheme = {};
  static _Components = {};
  static packages = packages;
  constructor({ component } = {}) {
    super();
    Object.assign(this, component);
    const tag = this.constructor.tag || component.tag || this.tag;
    this.setupProperties(component.props || this.constructor.properties);
    if (tag) this.classList.add(tag);
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
      if (prop.defaultValue) {
        this[key] = prop.defaultValue;
      }
      if (prop.sync) defineSyncProperty(this, key, prop);
    });
  }
  q(element) {
    return this.shadowRoot.querySelector(element);
  }
  qa(element) {
    return this.shadowRoot.querySelectorAll(element);
  }
  qaSlot(tagName) {
    const slot = this.q("slot");
    const nodes = slot.assignedElements({ flatten: true });
    return tagName
      ? nodes.filter(
          (node) => node.tagName.toLowerCase() === tagName.toLowerCase(),
        )
      : nodes;
  }

  static define(tag, component) {
    if (_Components[tag]) return;
    _Components[tag] = component;
    console.log({ _Components });
    if (component.theme)
      ReactiveView.addThemeClasses({ tag, _theme: component.theme });
  }

  static install() {
    Object.keys(_Components).forEach((tag) => {
      const component = this._Components[tag];
      const { css } = __unocss_runtime.uno.generate(tag, { preflights: true });
      console.log({ css });
      const style = new CSSStyleSheet();
      style.replaceSync(css);
      component.styles = [
        style,
        ...(Array.isArray(component.style)
          ? component.style
          : [component.style]),
      ].filter(Boolean);

      customElements.define(tag, component);
    });
  }

  static addThemeClasses = ({ tag, _theme: theme } = {}) => {
    if (!theme) return;
    Object.entries(theme).forEach(([key, value = ""]) => {
      if (typeof value !== "string") return;

      if (key.startsWith(".")) {
        ReactiveView.UnoTheme[key.substring(1)] = value;
      } else {
        const classes = !key
          ? value
          : value
              .split(" ")
              .map((className) => `${key}:${className}`)
              .join(" ");
        ReactiveView.UnoTheme[tag] = ReactiveView.UnoTheme[tag]
          ? `${ReactiveView.UnoTheme[tag]} ${classes}`
          : classes;
      }
    });
  };
}

export default ReactiveView;
