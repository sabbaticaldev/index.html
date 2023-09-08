import { ActionController } from "bootstrapp";

export class TaskController extends ActionController {
  static collection = "task";
  toggleTask = (id) => {
    const task = this.findById(id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      this.edit(id, updatedTask);
    }
  };

  findById = (id) => {
    return this.host.tasks.find((t) => t.id === id);
  };

  listCompleted = () => {
    return this.listBy((task) => task.completed);
  };
}
