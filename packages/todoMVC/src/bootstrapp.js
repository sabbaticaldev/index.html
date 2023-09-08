import { unsafeCSS } from "lit";
import { defineView, defineController } from "bootstrapp";
import tailwind from "./assets/base.css";
import { ReactiveRecord } from "bootstrapp";

const style = unsafeCSS(tailwind);

const classifyFile = ([path, module]) => {
  const nameMatch = /\/([\w\-_]+)\.(view|controller|model)\./.exec(path);
  if (!nameMatch) return null;

  const name = nameMatch[1];
  const type = nameMatch[2];
  return { name, type, module: module.default };
};

const reduceFiles = (acc, file) => {
  if (file) {
    acc[file.type][file.name] = file.module;
  }
  return acc;
};

const defineControllers = (controllers) => {
  return Object.fromEntries(
    Object.entries(controllers).map(([name, module]) => [
      name,
      defineController(module),
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

const defineViews = (views, controllers, models) => {
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

const bootstrapp = (files) => {
  const categorized = Object.entries(files)
    .map(classifyFile)
    .reduce(reduceFiles, { view: {}, controller: {}, model: {} });

  const controllers = defineControllers(categorized.controller);
  const models = defineModels(categorized.model);
  const views = defineViews(categorized.view, controllers, models);

  return { views, controllers, models };
};

const files = import.meta.glob("./app/**/*.{js,ts}", { eager: true });

const { views } = bootstrapp(files);
export default views.index;
