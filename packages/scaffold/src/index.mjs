import { definePackage } from "./reactive-view.mjs";
import uiKit from "uix/packages/ui.package.mjs";
import uxKit from "uix/packages/ux.package.mjs";
import appKit from "uix/packages/app.package.mjs";
import formKit from "uix/packages/form.package.mjs";
import typographyKit from "uix/packages/typography.package.mjs";
import docsKit from "uix/packages/docs.package.mjs";
import navigationKit from "uix/packages/navigation.package.mjs";
import layoutKit from "uix/packages/layout.package.mjs";
import contentKit from "uix/packages/content.package.mjs";
import datetimeKit from "uix/packages/datetime.package.mjs";

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
    uxKit,
    typographyKit,
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
