import { ReactiveRecord } from "bootstrapp";

export const Task = new ReactiveRecord(
  {
    todos: [],
    filter: "all", // options: 'all', 'active', 'completed'
  },
  { storage: "url" }
);
