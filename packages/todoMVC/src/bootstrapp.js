import { html, unsafeCSS } from "lit";
import { define } from "bootstrapp";
import TodoModel from "./app/models/todo.model.js";
import { TodoController } from "./app/controllers/todo.controller.js";
import tailwind from "./assets/base.css";
import { ReactiveRecord } from "bootstrapp";

export const Todo = new ReactiveRecord(TodoModel);
const style = unsafeCSS(tailwind);

// This function will process each module's default export.
// Update this function to transform the module's export as you need.

function bootstrapp() {
  const views = import.meta.glob("./app/views/**/*.{js,ts}", {
    eager: true,
  });

  let components = [];

  // Process each module and collect the processed objects
  Object.values(views).forEach((module) => {
    const view = module.default;
    const component = define(view, {
      appState: Todo,
      style,
      controllers: { todo: TodoController },
    });
    components.push(component);
  });
  return components;
}

export const components = bootstrapp();

export const Bootstrapp = define(
  {
    tag: "start-bootstrapp",
    render: function () {
      return html`<todo-app class="p-4"></todo-app>`;
    },
  },
  { style }
);
