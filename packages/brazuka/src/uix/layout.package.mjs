import T from "brazuka-helpers";
import { droparea } from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import {
  html as staticHtml,
  unsafeStatic
} from "https://esm.sh/lit/static-html.js";

import { generateTheme } from "../uix.theme.mjs";

export default {
  views: {
    "uix-block": {
      props: {
        color: T.string(),
        bgColor: T.string(),
        textColor: T.string(),
        spacing: T.string({ defaultValue: "md" }),
        rounded: T.boolean(),
        shadow: T.boolean(),
        containerClass: T.string()
      },
      render: (props) => {
        const baseClass = generateTheme("uix-block", props);
        return html`
          <div class=${baseClass}>
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-list": {
      props: {
        vertical: T.boolean(),
        responsive: T.boolean(),
        tag: T.string({ defaultValue: "div" }),
        reverse: T.boolean(),
        droparea: T.boolean(),
        justify: T.string(),
        spacing: T.string({ defaultValue: "" }),
        gap: T.string({ defaultValue: "sm" }),
        full: T.boolean(),
        rounded: T.boolean(),
        containerClass: T.string()
      },
      ...droparea,
      render: (props) => {
        const { tag } = props;
        const baseClass = generateTheme("uix-list", props);
        return staticHtml`
          <${unsafeStatic(tag)}            
            class="${unsafeStatic(baseClass)}">
            <slot></slot>
          </${unsafeStatic(tag)}>
        `;
      }
    }
  }
};
