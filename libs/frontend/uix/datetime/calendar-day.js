import { html, T } from "helpers";

export default {
  props: {
    previous: T.boolean(),
    next: T.boolean(),
    currentDay: T.boolean(),
    selected: T.boolean(),
    day: T.number(),
  },
  theme: {
    "uix-calendar-day": ({ previous, next, currentDay, selected }) => ({
      _base: `focus:z-10 w-full p-1.5 ${
        (!next && !previous) || currentDay || selected ? "bg-white" : ""
      } ${currentDay ? "text-indigo-600 font-semibold" : ""}`,
    }),
    "uix-calendar-day__time": ({ selected }) => ({
      _base: `mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
        selected ? "bg-gray-900 font-semibold text-white" : ""
      }`,
    }),
  },
  render() {
    return html` <button
      type="button"
      class=${this.theme("uix-calendar-day", {
        previous: this.previous,
        next: this.next,
        currentDay: this.currentDay,
        selected: this.selected,
      })}
    >
      <time
        datetime="2022-01-01"
        class=${this.theme("uix-calendar-day__time", {
          selected: this.selected,
        })}
        >${this.day}</time
      >
    </button>`;
  },
};