import events from "../events.js";
import { LitElement } from "../libs/lit.js";
import unoRuntime from "../libs/unocss.runtime.js";
import { defineSyncProperty, requestUpdateOnUrlChange } from "./sync.js";
window.addEventListener("popstate", requestUpdateOnUrlChange);
const reset =
  '*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color,#e5e7eb)}::after,::before{--un-content:\'\'}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}';
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
