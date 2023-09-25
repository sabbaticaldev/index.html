import { defineViews } from "./view/reactive-view.mjs";

const classifyFile = ([path, module]) => {
  const nameMatch = /\/([\w\-_]+)\.(view|controller|model)\./.exec(path);
  if (!nameMatch) return null;

  const name = nameMatch[1];
  const type = nameMatch[2];
  return { name, type, module: module.default };
};

const reduceFiles = (acc, file) => {
  if (file) {
    const fileName = file?.module?.tag || file.name; //if is a view and have a tag, it is preferred
    acc[file.type][fileName] = file.module;
  }
  return acc;
};

const bootstrapp = ({ files, style, onLoad, bootstrappTag = "app-index" }) => {
  const plugins = import.meta.glob("./plugins/**/*.{js,ts}", { eager: true });

  // Merge files and plugins
  const allFiles = { ...plugins, ...files };
  const categorized = Object.entries(allFiles)
    .map(classifyFile)
    .reduce(reduceFiles, { view: {}, controller: {}, model: {} });

  
  if(onLoad) {
    onLoad();
  }
  
  const views = defineViews(categorized.view, { style });
  
  
  return views[bootstrappTag];
};

export default bootstrapp;





