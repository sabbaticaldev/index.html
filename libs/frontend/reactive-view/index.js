import { TYPE_MAP } from "helpers";
import {
  requestUpdateOnUrlChange
} from "./sync.js";
import ReactiveView, { addThemeClasses } from "./base.js";
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

export const _LoadedComponents = {};

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

let _tailwindBase;
const getProperties = (props) =>
  Object.keys(props || {}).reduce((acc, key) => {
    const value = props[key];
    acc[key] = { ...value, type: TYPE_MAP[value.type] || TYPE_MAP.string, reflect: true };
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
