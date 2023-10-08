import { defineViews } from "./reactive-view.mjs";

import uiKit from "./packages/ui.package.mjs";
import uxKit from "./packages/ux.package.mjs";
import appKit from "./packages/app.package.mjs";
import formKit from "./packages/form.package.mjs";
import typographyKit from "./packages/typography.package.mjs";
import docsKit from "./packages/docs.package.mjs";

const bootstrapp = (
  app,
  { style, firstUpdated, bootstrappTag = "app-index" } = {}
) => {
  if (firstUpdated) {
    firstUpdated();
  }

  const views = defineViews(app.views, { style, i18n: app.i18n });
  defineViews(uxKit.views, { style, i18n: uxKit.i18n });
  defineViews(typographyKit.views, { style });
  defineViews(appKit.views, { style, i18n: appKit.i18n });
  defineViews(uiKit.views, { style, i18n: uiKit.i18n });
  defineViews(formKit.views, { style, i18n: formKit.i18n });
  defineViews(docsKit.views, { style, i18n: docsKit.i18n });
  return views[bootstrappTag];
};

export default bootstrapp;

export { bootstrapp };
