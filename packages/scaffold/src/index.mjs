import { defineViews } from "./view/reactive-view.mjs";
import uix from "./uix.package.mjs";


const bootstrapp = (app, { style, onLoad, bootstrappTag = "app-index" } = {}) => {  
  if(onLoad) {
    onLoad();
  }
  
  const views = defineViews(app.views, { style, i18n: app.i18n });
  defineViews(uix, { style, i18n: uix.i18n });
  return views[bootstrappTag];
};

export default bootstrapp;






export { bootstrapp };
