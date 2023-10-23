import T from "brazuka-helpers";
import { droparea } from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import {
  html as staticHtml,
  unsafeStatic
} from "https://esm.sh/lit/static-html.js";

import {
  Gaps,
  Sizes,
  Colors,
  SpacingSizes,
  BlockColors
} from "../uix.theme.mjs";

export default {
  views: {
    "uix-block": {
      props: {
        color: T.string({ enum: Colors }),
        bgColor: T.string(),
        textColor: T.string(),
        spacing: T.string({ defaultValue: "md" }),
        rounded: T.boolean(),
        shadow: T.boolean(),
        containerClass: T.string()
      },
      render: (props) => {
        const {
          containerClass,
          color,
          bgColor,
          textColor,
          spacing,
          rounded,
          shadow
        } = props;
        const baseClass = [
          bgColor ? `bg-${bgColor}` : "",
          textColor ? `text-${textColor}` : "",
          SpacingSizes[spacing],
          BlockColors[color],
          rounded ? "rounded" : "",
          shadow ? "shadow-md" : "",
          containerClass
        ]
          .filter(Boolean)
          .join(" ");
        return html`
          <div class=${baseClass}>
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-card": {
      props: {},
      render: () => {
        return html`<div
          class="card card-bordered bg-white rounded-none shadow"
        >
          <div class="card-body items-center text-center">
            <slot></slot>
          </div>
        </div>`;
      }
    },
    "uix-list": {
      props: {
        vertical: T.boolean(),
        responsive: T.boolean(),
        tag: T.string({ defaultValue: "div" }),
        reverse: T.boolean(),
        droparea: T.boolean(),
        spacing: T.string({ defaultValue: "" }),
        gap: T.string({ defaultValue: "sm", enum: Sizes }),
        full: T.boolean(),
        rounded: T.boolean(),
        containerClass: T.string(),
        id: T.string()
      },
      ...droparea,
      render: (props) => {
        const {
          containerClass,
          full,
          vertical,
          gap,
          responsive,
          reverse,
          rounded,
          tag,
          spacing
        } = props;
        const directionClass = vertical
          ? reverse
            ? "flex-col-reverse"
            : "flex-col"
          : reverse
            ? "flex-row-reverse"
            : "flex-row";

        const responsiveClass =
          (responsive &&
            (vertical
              ? "lg:flex-col sm:flex-row"
              : "sm:flex-col lg:flex-row")) ||
          "";
        const borderRadiusClass = rounded
          ? "rounded-l-full rounded-r-full"
          : "";
        const gapClass = Gaps[gap] || "";

        return staticHtml`
          <${unsafeStatic(tag)}
            id="uix-list"
            class="${unsafeStatic(
    [
      "flex w-full",
      full ? "h-full" : "",
      gapClass,
      directionClass,
      responsiveClass,
      borderRadiusClass,
      containerClass,
      SpacingSizes[spacing]
    ]
      .filter(Boolean)
      .join(" ")
  )}">
            <slot></slot>
          </${unsafeStatic(tag)}>
        `;
      }
    }
  }
};
