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
    "uix-mockup-code": {
      props: {
        prefix: T.string(),
        code: T.string(),
        highlight: T.boolean(),
        color: T.string({ enum: Colors })
      },
      render: ({ prefix, code, highlight, color }) => {
        const colorSchema = color
          ? [BgColor[color], TextColor[color]].join(" ")
          : "";
        const highlightClass = highlight ? colorSchema : "";

        return html`
          <div class="mockup-code ${colorSchema}">
            <pre
              class="${highlightClass}"
              data-prefix="${prefix}"
            ><code>${code}</code></pre>
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
