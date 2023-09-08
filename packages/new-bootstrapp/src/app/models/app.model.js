import { ReactiveRecord } from "bootstrapp";

const appState = new ReactiveRecord({
  darkMode: false,
  apps: null,
  boards: [
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
});

export default appState;
