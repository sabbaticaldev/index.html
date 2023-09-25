export const queue = [];

export class ControllerClass {
  constructor(controller, model, systemEventModel) {
    this.eventQueue = systemEventModel;
    this.model = model;
    this.modelName = model.name;
    this.name = model.name.replace("Model", "Controller");
  }

  add = (record) => {
    return this.model.add(record).then(result => {      
      return result;
    });
  };

  addMany = async (records) => {
    return this.model.addMany(records).then(result => {        
      return result;
    });
  };

  get = (id) => {
    return this.model.get(id);
  };

  getMany = async () => {    
    return this.model.getMany();
  };

  edit = async (updates) => {
    return this.model.edit(updates);
  };


  editMany = async (updates) => {
    return this.model.editMany([updates]);
  };

  remove = async (id) => {
    return this.model.remove(id);
  };
};

export const defineControllers = (controllers, models) => {
  return Object.fromEntries(
    Object.entries(controllers).map(([name, module]) => [
      name,
      new ControllerClass(module, models[name.replace("Controller", "Model")], models.systemevent),
    ])
  );
};
