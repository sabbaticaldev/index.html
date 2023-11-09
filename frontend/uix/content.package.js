import { T } from "../helpers/types.js";
import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";

export default {
  views: {
    "uix-card": {
      props: {
        border: T.boolean({ defaultValue: true }),
        shadow: T.boolean({ defaultValue: true }),
        bg: T.string({ defaultValue: "white" }),
        text: T.string(),
        rounded: T.boolean({ defaultValue: "none" }),
        spacing: T.string({ defaultValue: "lg" }),
      },
      render: function () {
        const baseClass = this.generateTheme("uix-card");
        return html`<uix-block containerClass=${baseClass}>
          <slot></slot>
        </uix-block>`;
      },
    },
    "uix-mockup-phone": {
      props: {
        prefix: T.string(),
        code: T.string(),
        highlight: T.boolean(),
        variant: T.string(),
      },
      render: function () {
        return html`
          <div
            class="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[700px] w-[400px] shadow-xl"
          >
            <div
              class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"
            ></div>
            <div
              class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"
            ></div>
            <div
              class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"
            ></div>
            <div
              class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"
            ></div>
            <div
              class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"
            ></div>
            <div
              class="rounded-xl overflow-hidden w-[372px] h-[672px] bg-white"
            >
              <slot></slot>
            </div>
          </div>
        `;
      },
    },
  },
};
