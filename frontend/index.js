import BaseReactiveView, {
  instances as reactiveViewInstances,
} from "./reactive-view.js";
import reset from "./reset.txt";
import appKit from "./uix/app.package.js";
import chatKit from "./uix/chat.package.js";
import contentKit from "./uix/content.package.js";
import crudKit from "./uix/crud.package.js";
import datetimeKit from "./uix/datetime.package.js";
import docsKit from "./uix/docs.package.js";
import formKit from "./uix/form.package.js";
import layoutKit from "./uix/layout.package.js";
import navigationKit from "./uix/navigation.package.js";
import uiKit from "./uix/ui.package.js";
/**
 * Defines and registers a custom element based on the provided configuration.
 *
 * @param {Object} component - The configuration object for the custom element.
 * @param {Object} [config={}] - Additional configuration parameters.
 * @returns {typeof LitElement}
 */
const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  date: Date,
  array: Array,
};

let _tailwindBase;
function defineView({ tag, component, style }) {
  const { props, formAssociated, style: componentStyle } = component;
  class ReactiveView extends BaseReactiveView {
    static formAssociated = formAssociated;
    static properties = !props
      ? {}
      : Object.keys(props).reduce((acc, key) => {
        const value = props[key];
        acc[key] = {
          ...value,
          type: TYPE_MAP[value.type] || TYPE_MAP["string"],
        };
        return acc;
      }, {});

    constructor() {
      super({ component });
    }
  }

  if (!_tailwindBase) {
    _tailwindBase = new CSSStyleSheet();
    _tailwindBase.replaceSync([reset, style].join(" "));
  }

  if (Array.isArray(componentStyle))
    ReactiveView.styles = componentStyle.concat(_tailwindBase).filter(Boolean);

  customElements.define(tag, ReactiveView);
  return ReactiveView;
}

const definePackage = ({ pkg, style }) => {
  const views = Object.fromEntries(
    Object.entries(pkg.views).map(([tag, component]) => {
      return [
        tag,
        defineView({
          tag,
          component,
          style,
        }),
      ];
    }),
  );
  return { views, models: pkg.models, controllers: pkg.controllers };
};

export {
  appKit,
  chatKit,
  contentKit,
  crudKit,
  datetimeKit,
  definePackage,
  defineView,
  docsKit,
  formKit,
  layoutKit,
  navigationKit,
  reactiveViewInstances,
  reset,
  uiKit,
};
