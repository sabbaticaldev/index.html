import { datetime, html, T } from "helpers";

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
const getFirstDayOfMonth = (month, year) =>
  new Date(year, month - 1, 1).getDay();
const getLastDayOfMonth = (month, year) =>
  new Date(year, month - 1, getDaysInMonth(month, year)).getDay();

const renderCalendarDays = (days, props) =>
  days.map(
    (day) => html`
      <uix-calendar-day
        day=${day}
        month=${props.month + (props.adjustment || 0)}
        ${props.attributes}
      ></uix-calendar-day>
    `,
  );

const isToday = (d, m, y) => {
  const today = new Date();
  return (
    d === today.getDate() &&
    m === today.getMonth() + 1 &&
    y === today.getFullYear()
  );
};

const renderCurrentMonthDays = (month, year, selectedDay) =>
  [...Array(getDaysInMonth(month, year))].map(
    (_, i) => html`
      <uix-calendar-day
        day="${i + 1}"
        month="${month}"
        ?currentDay=${isToday(i + 1, month, year)}
        ?selected=${i + 1 === selectedDay}
      ></uix-calendar-day>
    `,
  );

const theme = () => ({
  "uix-time": "whitespace-nowrap",
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
  "uix-calendar-month__header":
    "mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500",
  "uix-calendar-month__grid":
    "isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200",
});

export default {
  i18n: {},
  theme,
  views: {
    "uix-time": {
      props: { timestamp: T.number() },
      render: function () {
        return html`<time class=${this.theme("uix-time")}
          >${datetime.formatTime(this.timestamp)}</time
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
    },
    "uix-calendar-month": {
      props: {
        month: T.number(),
        year: T.number(),
        selectedDay: T.number(),
      },
      render: function () {
        const daysToPrepend = getFirstDayOfMonth(this.month, this.year) || 6;
        const previousMonthDays = getDaysInMonth(this.month - 1, this.year);

        return html`
          <uix-list vertical>
            <div class=${this.theme("uix-calendar-month__header")}>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div class=${this.theme("uix-calendar-month__grid")}>
              ${renderCalendarDays(
    [...Array(daysToPrepend)].map(
      (_, i) => previousMonthDays - daysToPrepend + i + 1,
    ),
    { month: this.month - 1, attributes: "previous=true" },
  )}
              ${renderCurrentMonthDays(this.month, this.year, this.selectedDay)}
              ${renderCalendarDays(
    [...Array(7 - getLastDayOfMonth(this.month, this.year))].map(
      (_, i) => i + 1,
    ),
    { month: this.month + 1, attributes: "next=true" },
  )}
            </div>
          </uix-list>
        `;
      },
    },
  },
};
