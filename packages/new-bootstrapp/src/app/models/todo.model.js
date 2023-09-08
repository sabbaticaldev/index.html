import { ReactiveRecord } from "bootstrapp";

export const Todo = new ReactiveRecord({
  todos: [],
  filter: "all", // options: 'all', 'active', 'completed'
});
