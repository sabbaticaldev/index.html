import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";

import { Colors, BgColor, TextColor } from "../uix.theme.mjs";

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
        // todo
      },
      render: () => {
        // TODO
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
