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
    "uix-timeline__list": "relative border-l border-gray-200 ml-4",
    "uix-timeline__item": "mb-10 ml-6",
    "uix-timeline__item-marker":
      "flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white",
    "uix-timeline__item-content": "pt-1.5 mb-4 text-sm text-gray-500",
    "uix-timeline__item-time":
      "mb-1 text-sm font-normal leading-none text-gray-400",
  },
  render() {
    return html`
      <ol data-theme="uix-timeline__list">
        ${this.items.map(
          (item) => html`
            <li data-theme="uix-timeline__item">
              <div data-theme="uix-timeline__item-marker"></div>
              <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
              <time data-theme="uix-timeline__item-time"> ${item.time} </time>
              <p data-theme="uix-timeline_item-content">${item.content}</p>
            </li>
          `,
        )}
      </ol>
    `;
  },
};

export default Timeline;
