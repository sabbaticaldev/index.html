import ActionController from "../action-controller";

export default (methodsObject) => {
  return class BaseController extends ActionController {
    constructor() {
      super();
      Object.keys(methodsObject).forEach(methodName => {
        this[methodName] = methodsObject[methodName].bind(this);
      });
    }
  };
}