import { defineViews } from "./view/reactive-view.mjs";
import uix from "./uix.package.mjs";


const bootstrapp = (app, { style, onLoad, bootstrappTag = "app-index" } = {}) => {  
  if(onLoad) {
    onLoad();
  }
  
  const uixViews = defineViews(uix, { style, i18n: uix.i18n });
  const views = defineViews(app.views, { style, i18n: app.i18n });
  
  console.log({uixViews});
  return views[bootstrappTag];
};

export default bootstrapp;





