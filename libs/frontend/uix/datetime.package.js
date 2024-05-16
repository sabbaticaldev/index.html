import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import datetime from "helpers/datetime.js";
import { T } from "helpers/types.js";

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
const getFirstDayOfMonth = (month, year) =>
  new Date(year, month - 1, 1).getDay();
const getLastDayOfMonth = (month, year) =>
  new Date(year, month - 1, getDaysInMonth(month, year)).getDay();

export default {
  i18n: {},
  views: {
    "uix-time": {
      props: { timestamp: T.number() },
      render: function () {
        const { timestamp } = this;
        return html`<time class="whitespace-nowrap"
          >${datetime.formatTime(timestamp)}</time
        >`;
      },
    },
    "uix-calendar-day": {
      props: {
        previous: T.boolean(),
        next: T.boolean(),
        currentDay: T.boolean(),
        selected: T.boolean(),
        day: T.number(),
      },
      render: function () {
        const { currentMonth, currentDay, next, previous, selected, day } =
          this;
        return html` <button
          type="button"
          class="focus:z-10 w-full p-1.5 ${(!next && !previous) ||
          currentDay ||
          selected
    ? "bg-white "
    : ""}  
                ${currentMonth ? " text-gray-900 hover:bg-gray-100" : ""}
                ${currentDay
    ? "font-semibold text-indigo-600 hover:bg-gray-100 "
    : ""}"
        >
          <time
            datetime="2022-01-01"
            class="mx-auto flex h-7 w-7 items-center justify-center rounded-full ${selected
    ? "bg-gray-900 font-semibold text-white"
    : ""}"
            >${day}</time
          >
        </button>`;
      },
    },
    "uix-calendar-month": {
      props: {
        month: T.number(),
        year: T.number(),
        selectedDay: T.number(),
      },
      render: function () {
        const { month, year, selectedDay } = this;
        const today = new Date();
        const isToday = (d, m, y) =>
          d === today.getDate() &&
          m === today.getMonth() + 1 &&
          y === today.getFullYear();

        // Calculate days to prepend from the previous month
        const daysToPrepend =
          getFirstDayOfMonth(month, year) === 0
            ? 6
            : getFirstDayOfMonth(month, year) - 1;
        const previousMonthDays = getDaysInMonth(month - 1, year);

        const prependedDays = [...Array(daysToPrepend)].map(
          (_, i) => html`
            <uix-calendar-day
              day="${previousMonthDays - daysToPrepend + i + 1}"
              previous="true"
              month="${month - 1}"
            ></uix-calendar-day>
          `,
        );

        // Generate days for the current month
        const currentMonthDays = [...Array(getDaysInMonth(month, year))].map(
          (_, i) => html`
            <uix-calendar-day
              day="${i + 1}"
              month="${month}"
              ?currentDay=${isToday(i + 1, month, year)}
              ?selected=${i + 1 === selectedDay}
            ></uix-calendar-day>
          `,
        );

        // Calculate days to append from the next month
        const daysToAppend = 7 - getLastDayOfMonth(month, year);
        const appendedDays = [...Array(daysToAppend)].map(
          (_, i) => html`
            <uix-calendar-day
              day="${i + 1}"
              next="true"
              month="${month + 1}"
            ></uix-calendar-day>
          `,
        );

        return html`
          <uix-list vertical>
            <div
              class="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500"
            >
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div
              class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
            >
              ${[...prependedDays, ...currentMonthDays, ...appendedDays]}
            </div>
          </uix-list>
        `;
      },
    },
  },
};
