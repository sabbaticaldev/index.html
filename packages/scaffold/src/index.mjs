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

const bootstrapp = (
  app,
  { style, firstUpdated, bootstrappTag = "app-index" } = {}
) => {
  if (firstUpdated) {
    firstUpdated();
  }

  const views = definePackage(app, { style });
  definePackage(appKit, { style });
  definePackage(navigationKit, { style });
  definePackage(docsKit, { style });
  definePackage(uxKit, { style });
  definePackage(typographyKit, { style });
  definePackage(uiKit, { style });
  definePackage(formKit, { style });
  definePackage(layoutKit, { style });
  definePackage(contentKit, { style });
  return views[bootstrappTag];
};

export default bootstrapp;

export { bootstrapp };
