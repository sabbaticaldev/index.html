export default {
  collection: "task",
  toggleTask: function (id, completed) {
    this.edit(id, { completed });
  },

  listCompleted: function () {
    return this.listBy((task) => task.completed);
  },

  addTask: function ({ target, key }) {
    if (key === "Enter" && !!target.value) {
      if (this.add({ title: target.value })) {
        target.value = "";
      }
    }
  },
};
