import { ReactiveRecord } from "bootstrapp";

export const Board = new ReactiveRecord(
  {
    boards: [],
    filter: "all", // options: 'all', 'active', 'completed'
  },
  { storage: "url" }
);
