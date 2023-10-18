import T from "bootstrapp-shared/types.mjs";
import { html } from "lit";
import {
  Colors,
  Sizes,
  HeadingColors,
  FontWeight,
  LinkColors,
} from "../uix.theme.mjs";

export default {
  views: {
    "uix-text": {
      props: {
        size: T.string({ enum: Sizes }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        weight: T.string({ defaultValue: "semibold", enum: FontWeight }),
        containerClass: T.string(),
      },
      render: (props) => {
        const { size, color, weight, containerClass } = props;
        const baseClass = [
          "prose font-roboto",
          HeadingColors[color],
          FontWeight[weight],
          containerClass,
          props.class,
        ]
          .filter(Boolean)
          .join(" ");

        const HeadingTemplates = {
          "4xl": html`<h1 class="text-4xl ${baseClass}">
            <slot></slot>
          </h1>`,
          "3xl": html`<h2 class="text-3xl ${baseClass}">
            <slot></slot>
          </h2>`,
          "2xl": html`<h2 class="text-2xl ${baseClass}">
            <slot></slot>
          </h2>`,
          xl: html`<h2 class="text-xl ${baseClass}">
            <slot></slot>
          </h2>`,
          lg: html`<h3 class="text-lg ${baseClass}">
            <slot></slot>
          </h3>`,
          md: html`<h4 class="text-md ${baseClass}">
            <slot></slot>
          </h4>`,
          sm: html`<h5 class="text-sm ${baseClass}">
            <slot></slot>
          </h5>`,
          xs: html`<h6 class="text-xs ${baseClass}">
            <slot></slot>
          </h6>`,
          "": html`<p class="text-base ${baseClass}"><slot></slot></p>`,
        };

        return HeadingTemplates[size || ""];
      },
    },
    "uix-link": {
      props: {
        href: T.string({ defaultValue: "#" }),
        label: T.string(),
        external: T.boolean(),
        color: T.string({ enum: Colors }),
        underlineOnHover: T.boolean(),
        icon: T.string({ defaultValue: null }),
      },
      render: ({ href, label, external, color, underlineOnHover, icon }) => {
        const baseClass = [
          "link",
          LinkColors[color],
          underlineOnHover ? "hover:underline" : "",
          (icon && "flex gap-2 items-center") || "",
        ]
          .filter(Boolean)
          .join(" ");
        const externalAttrs = external
          ? "target=\"_blank\" rel=\"noopener noreferrer\""
          : "";

        return html`
          <a href=${href} class=${baseClass} ${externalAttrs}>
            ${icon ? html`<uix-icon name="${icon}"></uix-icon>` : ""}
            ${label || html`<slot></slot>`}
          </a>
        `;
      },
    },
  },
};
