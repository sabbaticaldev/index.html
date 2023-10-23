import { definePackage } from "./src/reactive-view.mjs";
import uiKit from "./src/uix/ui.package.mjs";
import chatKit from "./src/uix/chat.package.mjs";
import appKit from "./src/uix/app.package.mjs";
import formKit from "./src/uix/form.package.mjs";
import docsKit from "./src/uix/docs.package.mjs";
import layoutKit from "./src/uix/layout.package.mjs";
import contentKit from "./src/uix/content.package.mjs";
import datetimeKit from "./src/uix/datetime.package.mjs";
import navigationKit from "./src/uix/navigation.package.mjs";

const definePackages = (packages, options) => {
  return packages.reduce(
    (acc, pkg) => {
      const result = definePackage(pkg, options);
      return {
        models: { ...acc.models, ...result.models },
        views: { ...acc.views, ...result.views },
        controllers: { ...acc.controllers, ...result.controllers }
      };
    },
    { models: {}, views: {}, controllers: {} }
  );
};

const bootstrapp = async (
  app,
  { style, init, bootstrappTag = "app-index" } = {}
) => {
  const kits = [
    app,
    appKit,
    navigationKit,
    docsKit,
    chatKit,
    uiKit,
    formKit,
    layoutKit,
    contentKit,
    datetimeKit
  ];

  const { models, views, controllers } = definePackages(kits, { style });
  await init?.({ models, controllers });

  return views[bootstrappTag];
};

export default bootstrapp;

export { bootstrapp };
