import { defineViews } from "./view/reactive-view.mjs";
import ui from "./ui.package.mjs";
import ux from "./ux.package.mjs";


const bootstrapp = (app, { style, onLoad, bootstrappTag = "app-index" } = {}) => {  
  if(onLoad) {
    onLoad();
  }
  
  const views = defineViews(app.views, { style, i18n: app.i18n });
  defineViews(ux.views, { style, i18n: ux.i18n });
  console.log(ux.views);
  defineViews(ui.views, { style, i18n: ui.i18n });
  return views[bootstrappTag];
};

export default bootstrapp;

export { bootstrapp };
