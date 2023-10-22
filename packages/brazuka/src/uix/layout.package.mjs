import T from "brazuka-helpers";
import { droparea } from "brazuka-helpers";
import { html } from "lit";

import {
  BgColor,
  AlignX,
  AlignY,
  Gaps,
  Spacings,
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
    "uix-stack": {
      props: {
        vertical: T.boolean(),
        gap: T.string({ defaultValue: "md", enum: Spacings })
      },
      render: ({ vertical, gap }) => {
        const gapClass = Gaps[gap] || "";
        const directionClass = vertical ? "flex-col" : "flex-row";
        return html`
          <div class="stack flex ${directionClass} ${gapClass}">
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-divider": {
      props: {
        thickness: T.string({ defaultValue: "1px" }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        text: T.string(),
        vertical: T.boolean(),
        responsive: T.boolean(),
        class: T.string()
      },

      render: (props) => {
        const { thickness, color, vertical, responsive } = props;
        const baseClass = [
          "divider",
          vertical ? "divider-vertical" : "divider-horizontal",
          responsive &&
            (vertical ? "lg:divider-horizontal" : "lg:divider-vertical"),
          BgColor[color],
          props.class
        ]
          .filter(Boolean)
          .join(" ");

        return html`
          <div class=${baseClass} style="height: ${thickness};">
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-list": {
      props: {
        vertical: T.boolean(),
        responsive: T.boolean(),
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
        return html`
          <div
            id="uix-list"
            class=${[
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
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-grid": {
      props: {
        templateColumns: T.string({ defaultValue: "1fr" }),
        templateRows: T.string(),
        gap: T.string({ defaultValue: "sm", enum: Sizes }),
        rounded: T.boolean(),
        alignX: T.string({ enum: Object.keys(AlignX) }),
        alignY: T.string({ enum: Object.keys(AlignY) })
      },
      render: ({
        templateColumns,
        templateRows,
        gap,
        rounded,
        alignX,
        alignY
      }) => {
        const borderRadiusClass = rounded
          ? "rounded-l-full rounded-r-full"
          : "";
        const gapClass = Gaps[gap] || "";
        const columnsClass = `grid-cols-${templateColumns}`;
        const rowsClass = templateRows ? `grid-rows-${templateRows}` : "";
        const alignXClass = alignX ? AlignX[alignX] : "";
        const alignYClass = alignY ? AlignY[alignY] : "";

        return html`
          <div
            class=${[
    "grid",
    gapClass,
    columnsClass,
    rowsClass,
    borderRadiusClass,
    alignXClass,
    alignYClass
  ]
    .filter(Boolean)
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      }
    }
  }
};
