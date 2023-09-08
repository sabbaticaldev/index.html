import { html, unsafeCSS } from "lit";
import { defineView, defineController, ReactiveRecord } from "bootstrapp";
import AppModel from "./app/models/app.model.js";
import tailwind from "./assets/base.css";
const style = unsafeCSS(tailwind);

// This function will process each module's default export.
// Update this function to transform the module's export as you need.

const apps = Object.values(
  import.meta.glob("../apps/**/bootstrapp.config.@(js|ts)", {
    eager: true,
  })
).map((module) => module.default);

const appsModels = Object.values(
  import.meta.glob("../apps/**/models/*.@(js|ts)", {
    eager: true,
  })
).map((module) => module.default);

const appState = new ReactiveRecord(AppModel);

apps.forEach((app) => {
  appState.add(app.name.toLowerCase(), app);
});

function bootstrapp() {
  const views = import.meta.glob("./app/views/**/*.{js,ts}", {
    eager: true,
  });

  const appsControllers = Object.values(
    import.meta.glob("../apps/**/controllers/*.@(js|ts)", {
      eager: true,
    })
  ).map((module) => module.default);

  const controllers = Object.values(
    import.meta.glob("./app/controllers/**/*.{js,ts}", {
      eager: true,
    })
  ).reduce((acc, module) => {
    const modelName = module.default.modelName;
    acc[modelName] = defineController(module.default, { modelName });
    return acc;
  }, {});

  const models = import.meta.glob("./app/models/**/*.{js,ts}", {
    eager: true,
  });

  return {
    components: Object.values(views).map((module) =>
      defineView(module.default, {
        appState,
        style,
        controllers,
      })
    ),

    apps: apps.map((app) => {
      defineView(app, {
        appState,
        style,
        controllers,
      });
    }),
  };
}

export const components = bootstrapp();

export const Bootstrapp = defineView(
  {
    tag: "bootstr-app",
    render: function () {
      return html`<app-container><slot></slot></app-container>`;
    },
  },
  { style }
);
