export default {
  collection: "todo",
  toggleTodo: function (id, completed) {
    this.edit(id, { completed });
  },

  listCompleted: function () {
    return this.listBy((todo) => todo.completed);
  },

  addTodo: function ({ target, key }) {
    if (key === "Enter" && !!target.value) {
      if (this.add({ title: target.value })) {
        target.value = "";
      }
    }
  },
};
