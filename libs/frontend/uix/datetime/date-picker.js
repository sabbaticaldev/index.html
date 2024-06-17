import { html, T } from "helpers";

export default {
  tag: "uix-date-picker",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    change: T.function(),
  },
  theme: {
    "uix-date-picker": "relative",
    "uix-date-picker__input": "w-full",
    "uix-date-picker__calendar": "absolute mt-1 z-10",
  },
  render() {
    return html`
      <uix-input
        type="text"
        .value=${this.value}
        class="uix-date-picker__input"
        @focus=${() => this.setOpen(true)}
      ></uix-input>
      ${this.open &&
      html`
        <div class="uix-date-picker__calendar">
          <uix-calendar
            .value=${this.value}
            .min=${this.min}
            .max=${this.max}
            .change=${this.change}
          ></uix-calendar>
        </div>
      `}
    `;
  },
};
