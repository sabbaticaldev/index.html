import { html, unsafeCSS } from "lit";
import { define } from "bootstrapp";
import appState from "./app/models/app.model.js";
import tailwind from "./assets/base.css";
const style = unsafeCSS(tailwind);

// This function will process each module's default export.
// Update this function to transform the module's export as you need.

const apps = Object.values(
  import.meta.glob("../apps/**/bootstrapp.config.@(js|ts)", {
    eager: true,
  })
).map((module) => module.default);

appState.setState("apps", apps);

function bootstrapp() {
  const views = import.meta.glob("./app/views/**/*.{js,ts}", {
    eager: true,
  });

  const controllers = Object.values(
    import.meta.glob("./app/controllers/**/*.{js,ts}", {
      eager: true,
    })
  ).reduce((acc, module) => {
    const collection = module.default.collection;
    acc[collection] = module.default;
    return acc;
  }, {});

  const models = import.meta.glob("./app/models/**/*.{js,ts}", {
    eager: true,
  });

  return {
    components: Object.values(views).map((module) =>
      define(module.default, {
        appState,
        style,
        controllers,
      })
    ),

    apps: apps.map((app) => {
      define(app, {
        appState,
        style,
        controllers,
      });
    }),
  };
}
export const components = bootstrapp();

export const Bootstrapp = define(
  {
    tag: "bootstr-app",
    render: function () {
      return html`<app-container><slot></slot></app-container>`;
    },
  },
  { style }
);
