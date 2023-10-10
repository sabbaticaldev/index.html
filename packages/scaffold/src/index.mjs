import { definePackage } from "./reactive-view.mjs";

import uiKit from "./packages/ui.package.mjs";
import uxKit from "./packages/ux.package.mjs";
import appKit from "./packages/app.package.mjs";
import formKit from "./packages/form.package.mjs";
import typographyKit from "./packages/typography.package.mjs";
import docsKit from "./packages/docs.package.mjs";
import navigationKit from "./packages/navigation.package.mjs";
import layoutKit from "./packages/layout.package.mjs";
import contentKit from "./packages/content.package.mjs";

const definePackages = (packages, options) => {
  return packages.reduce(
    (acc, pkg) => {
      const result = definePackage(pkg, options);
      return {
        models: { ...acc.models, ...result.models },
        views: { ...acc.views, ...result.views }
      };
    },
    { models: {}, views: {} }
  );
};

const bootstrapp = (app, { style, init, bootstrappTag = "app-index" } = {}) => {
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
    contentKit
  ];
  const { models, views } = definePackages(kits, { style });
  console.log({ models });
  init?.({ models });

  return views[bootstrappTag];
};

export default bootstrapp;

export { bootstrapp };
