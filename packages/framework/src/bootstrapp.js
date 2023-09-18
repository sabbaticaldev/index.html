import { defineController } from "./controller/reactive-controller.js";
import defineView from "./view/reactive-view.js";
import ReactiveRecord from "./model/reactive-record.js";

const defineControllers = (controllers) => {
  return Object.fromEntries(
    Object.entries(controllers).map(([name, module]) => [
      name,
      defineController(module, {modelName: name}),
    ])
  );
};

const defineModels = (models) => {
  return Object.fromEntries(
    Object.entries(models).map(([name, module]) => [
      name,
      new ReactiveRecord(module),
    ])
  );
};

const defineViews = (views, { controllers, models, style }) => {
  return Object.fromEntries(
    Object.entries(views).map(([name, view]) => {
      const controllerName = view.controller || name;
      const modelName = view.modelName || controllerName;
      return [
        name,
        defineView(view, {
          appState: models[modelName],
          style,
          controllers: { [controllerName]: controllers[controllerName] },
        }),
      ];
    })
  );
};

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

  const controllers = defineControllers(categorized.controller) || {};
  const models = defineModels(categorized.model)  || {};
  
  if(onLoad) {
    onLoad(models);
  }
  
  const views = defineViews(categorized.view, { controllers, models, style });
  
  
  return views[bootstrappTag];
};


export default bootstrapp;





