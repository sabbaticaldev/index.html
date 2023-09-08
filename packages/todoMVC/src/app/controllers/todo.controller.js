import { ActionController } from "bootstrapp";

export class TodoController extends ActionController {
  static collection = "todo";
  toggleTodo = (id, completed) => {
    this.edit(id, { completed });
  };

  listCompleted = () => {
    return this.listBy((todo) => todo.completed);
  };

  addTodo = ({ target, key }) => {
    if (key === "Enter" && !!target.value) {
      if (this.add({ title: target.value })) {
        target.value = "";
      }
    }
  };
}
