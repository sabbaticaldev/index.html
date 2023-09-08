import ActionController from "../action-controller";

export default function defineController(methodsObject) {
  return class DynamicController extends ActionController {
    constructor(host, appState) {
      super(host, appState);
      Object.keys(methodsObject).forEach((methodName) => {
        this[methodName] =
          typeof methodsObject[methodName] === "function"
            ? methodsObject[methodName].bind(this)
            : methodsObject[methodName];
      });
    }
  };
}