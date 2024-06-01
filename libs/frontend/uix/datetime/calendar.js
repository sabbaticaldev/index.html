import { html, T } from "helpers";

const Calendar = {
  tag: "uix-calendar",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    change: T.function(),
  },
  theme: {
    "uix-calendar": "",
  },
  render() {
    return html`
      <div data-theme="uix-calendar">
        <uix-calendar-month
          month=${new Date(this.value).getMonth() + 1}
          year=${new Date(this.value).getFullYear()}
          .selectedDay=${new Date(this.value).getDate()}
          .min=${this.min}
          .max=${this.max}
          .change=${this.change}
        ></uix-calendar-month>
      </div>
    `;
  },
};

export default Calendar;
