import { html, T } from "helpers";

const Timeline = {
  tag: "uix-timeline",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        title: T.string(),
        content: T.string(),
        time: T.string(),
      },
    }),
  },
  theme: {
    "uix-timeline": "relative border-l border-gray-200 ml-4",
    "uix-timeline-item": "mb-10 ml-6",
    "uix-timeline-item__marker":
      "flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white",
    "uix-timeline-item__content": "pt-1.5 mb-4 text-sm text-gray-500",
    "uix-timeline-item__time":
      "mb-1 text-sm font-normal leading-none text-gray-400",
  },
  render() {
    return html`
      <ol class=${this.theme("uix-timeline")}>
        ${this.items.map(
          (item) => html`
            <li class=${this.theme("uix-timeline-item")}>
              <div class=${this.theme("uix-timeline-item__marker")}></div>
              <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
              <time class=${this.theme("uix-timeline-item__time")}>
                ${item.time}
              </time>
              <p class=${this.theme("uix-timeline-item__content")}>
                ${item.content}
              </p>
            </li>
          `,
  )}
      </ol>
    `;
  },
};

export default Timeline;
