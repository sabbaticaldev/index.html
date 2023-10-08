import {
  Colors,
  Sizes,
  HeadingColors,
  LinkColors,
  FontWeight
} from "../style-props.mjs";

export default {
  views: {
    "uix-text": {
      props: {
        size: { type: String, defaultValue: "", enum: Sizes },
        color: { type: String, defaultValue: "primary", enum: Colors },
        weight: { type: String, defaultValue: "semibold", enum: Colors },
        class: { type: String, defaultValue: "" }
      },
      render: (props, { html }) => {
        const { size, color, weight } = props;
        const baseClass = [
          "prose",
          HeadingColors[color],
          FontWeight[weight],
          props.class
        ];

        const HeadingTemplates = {
          "2xl": html`<h1 class="text-5xl mt-0 mb-2 ${baseClass}">
            <slot></slot>
          </h1>`,
          xl: html`<h2 class="text-3xl mt-0 mb-2 ${baseClass}">
            <slot></slot>
          </h2>`,
          lg: html`<h3 class="text-2xl mt-0 mb-2 ${baseClass}">
            <slot></slot>
          </h3>`,
          md: html`<h4 class="text-xl  mt-0 mb-2 ${baseClass}">
            <slot></slot>
          </h4>`,
          sm: html`<h5 class="text-lg mt-0 mb-2 ${baseClass}">
            <slot></slot>
          </h5>`,
          xs: html`<h6 class="text-xs mt-0 mb-1 ${baseClass}">
            <slot></slot>
          </h6>`,
          "": html`<p class="text-base ${baseClass}"><slot></slot></p>`
        };

        return HeadingTemplates[size || ""];
      }
    },
    "uix-link": {
      props: {
        href: { type: String, defaultValue: "#" },
        label: { type: String, defaultValue: "" },
        external: { type: Boolean, defaultValue: false },
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        },
        underlineOnHover: { type: Boolean, defaultValue: false },
        icon: { type: String, defaultValue: null }
      },
      render: (
        { href, label, external, color, underlineOnHover, icon },
        { html }
      ) => {
        const baseClass = [
          "link",
          LinkColors[color],
          underlineOnHover ? "hover:underline" : "",
          (icon && "flex gap-2 items-center") || ""
        ]
          .filter((cls) => !!cls)
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
      }
    }
  }
};
