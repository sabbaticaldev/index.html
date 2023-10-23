import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import { generateTheme, Colors, BgColor, TextColor } from "../uix.theme.mjs";

export default {
  views: {
    "uix-alert": {
      props: {
        // TODO
      },
      render: () => {
        // todo
      }
    },

    "uix-card": {
      props: {
        border: T.boolean({ defaultValue: true }),
        shadow: T.boolean({ defaultValue: true }),
        bg: T.string({ defaultValue: "white" }),
        text: T.string(),
        rounded: T.boolean({ defaultValue: "none" }),
        spacing: T.string({ defaultValue: "lg" })
      },
      render: (host) => {
        const baseClass = generateTheme("uix-card", host);
        return html`<uix-block containerClass=${baseClass}>
          <slot></slot>
        </uix-block>`;
      }
    },
    "uix-mockup-phone": {
      props: {
        prefix: T.string(),
        code: T.string(),
        highlight: T.boolean(),
        color: T.string({ enum: Colors })
      },
      render: () => {
        return html`
          <div
            class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[600px] w-[300px] shadow-xl"
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
              class="rounded-xl overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800"
            >
              <slot></slot>
            </div>
          </div>
        `;
      }
    },
    "uix-tooltip": {
      props: {
        // TODO
      },
      render: () => {}
    },
    "uix-toast": {
      props: {},
      render: () => {
        // todo
      }
    }
  }
};
