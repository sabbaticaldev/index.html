import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import ReactiveRecord from './reactive-record';
import ActionController from './action-controller';

/**
 * Defines and registers a custom element based on the provided configuration.
 *
 * @param {Object} component - The configuration object for the custom element.
 * @param {Object} [config={}] - Additional configuration parameters.
 * @returns {typeof LitElement}
 */
function define(component, config = {}) {
  // Destructure properties from the component configuration
  const {
    controller,
    tag,
    props = {},
    render,
    onLoad,
  } = component;

  const { controllers = {}, appState, style } = config;

  class FunctionalComponent extends LitElement {
    // Define the properties for LitElement
    static properties = Object.entries(props)
      .filter(([key, prop]) => 
        !( ['list', 'record'].includes(key) && prop.scope === 'app' ) // this property is managed by the Action Controller
      )
      .reduce((acc, [key, prop]) => {
        acc[key] = {
          type: prop.type,
          noAccessor: !!prop.readonly,
          defaultValue: prop.defaultValue,
        };
        return acc;
      }, {});

    constructor() {
      super();
      this.html = html;

      if (controller && controllers[controller]) {
        this.controller = new controllers[controller](this, appState);
      }

      const propKeys = Object.keys(props);
      const stateKeys = propKeys.filter(key => !props[key].readonly);

      for (const key of stateKeys) {
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        this[setterName] = (newValue) => {
          if (appState && props[key].scope === 'app') {
            appState.setState(key, newValue);
          }
          else {
            this[key] = newValue;
          }
        };
      }
    }

    disconnectedCallback() {
      if (this instanceof LitElement) {
        super.disconnectedCallback();
      }
      if(this.controller && this.controller.subscriptionCallbacks?.length > 0) {
        for (const key of Object.keys(this.controller.subscriptionCallbacks)) {
          this.controller.unsubscribe(key);
        }
      }
    }

    firstUpdated() {
      onLoad?.(this);
    }

    render() {
      return component.template || render?.(this, this.controller) || html`<h1>Error: no render function or template.</h1>`;
    }
  }

  FunctionalComponent.styles = style ? [style] : undefined;
  FunctionalComponent.props = props;

  // Register the custom element
  customElement(tag)(FunctionalComponent);

  return FunctionalComponent;
}

export { ReactiveRecord, define, ActionController };
