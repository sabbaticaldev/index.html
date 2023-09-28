import { defineViews } from "./view/reactive-view.mjs";


const bootstrapp = (app, { style, onLoad, bootstrappTag = "app-index" } = {}) => {  
  if(onLoad) {
    onLoad();
  }
  
  const views = defineViews(app.views, { style, i18n: app.i18n });
  
  console.log({views});
  return views[bootstrappTag];
};

export default bootstrapp;





