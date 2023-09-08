import ActionController from "../action-controller";

export default function defineController(controller, convention) {
  return class DynamicController extends ActionController {
    constructor(host, config) {
      super(host, config);
      this.modelName = convention?.modelName;
      Object.keys(controller).forEach((prop) => {
        this[prop] =
          typeof controller[prop] === "function"
            ? controller[prop].bind(this)
            : controller[prop];
      });
    }
  };
}