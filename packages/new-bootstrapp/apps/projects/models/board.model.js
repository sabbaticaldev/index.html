export default {
  name: "board",
  data: [
    {
      id: "to-do",
      name: "To Do",
      tasks: [
        { priority: "high", task: "create additional fields for payment flow" },
      ],
    },
    { id: "doing", name: "Doing", tasks: [] },
    { id: "done", name: "Done", tasks: [] },
  ],
};
