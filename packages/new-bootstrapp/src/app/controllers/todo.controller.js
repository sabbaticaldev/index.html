import { ActionController } from "bootstrapp";

export default class TodoController extends ActionController {
  static collection = "todo";
  toggleTodo = (id) => {
    const todo = this.findById(id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      this.edit(id, updatedTodo);
    }
  };

  findById = (id) => {
    return this.host.todos.find((t) => t.id === id);
  };

  listCompleted = () => {
    return this.listBy((todo) => todo.completed);
  };
}
