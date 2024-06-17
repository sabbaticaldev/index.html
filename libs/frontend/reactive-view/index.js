import { TYPE_MAP } from "helpers";

import ReactiveView from "./base.js";
import { requestUpdateOnUrlChange } from "./sync.js";

window.addEventListener("popstate", requestUpdateOnUrlChange);

let _tailwindBase;
const getProperties = (props) =>
  Object.keys(props || {}).reduce((acc, key) => {
    const value = props[key];
    acc[key] = {
      ...value,
      type: TYPE_MAP[value.type] || TYPE_MAP.string,
      reflect: true,
    };
    return acc;
  }, {});

export function defineView({ key, component, style: globalStyle }) {
  const tag = component.tag;
  if (!tag)
    console.error(`Error: component ${key} doesn't have a tag property`);
  class View extends ReactiveView {
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
