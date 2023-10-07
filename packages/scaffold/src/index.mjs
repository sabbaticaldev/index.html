import { defineViews } from "./view/reactive-view.mjs";
import uiKit from "./ui.package.mjs";
import uxKit from "./ux.package.mjs";
import appKit from "./app.package.mjs";
import formKit from "./form.package.mjs";
import typographyKit from "./typography.package.mjs";
import docsKit from "./docs.package.mjs";

const bootstrapp = (
  app,
  { style, onLoad, bootstrappTag = "app-index" } = {}
) => {
  if (onLoad) {
    onLoad();
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
