export const queue = [];

export class ControllerClass {
  constructor(model) {
    this.model = model;
    this.name = model.name;
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

export const defineControllers = (models) => {
  return Object.fromEntries(
    Object.keys(models).map((name) => [
      name,
      new ControllerClass(models[name]),
    ])
  );
};
