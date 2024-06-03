import { html, T } from "helpers";

const linkRender = (item) => html`
  <uix-link
    href=${item.href}
    .onclick=${item.onclick}
    data-theme="uix-navbar__link"
    ?active=${item.active}
  >
    ${item.label}
  </uix-link>
`;
const subNavbarRender = (item) =>
  item.variant === "accordion"
    ? accordionRender(item)
    : html`
        <span>${item.label}</span>
        <uix-navbar .items=${item.items}></uix-navbar>
      `;

const accordionRender = (item) => html`
  <uix-accordion
    ?border=${item.border}
    ?multiple=${item.multiple}
    .items=${[
      {
        ...item,
        content: item.items.map((item) => linkRender(item)),
      },
    ]}
  ></uix-accordion>
`;
export default {
  tag: "uix-navbar",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        href: T.string({ nullable: true }),
        onclick: T.function(),
        open: T.boolean(),
        active: T.boolean({ defaultValue: false }),
        variant: T.string({
          defaultValue: "fixed",
          enum: ["fixed", "accordion"],
        }),
        items: T.array({
          defaultValue: [],
          type: {
            label: T.string(),
            href: T.string(),
            active: T.boolean({ defaultValue: false }),
          },
        }),
      },
    }),
  },
  theme: {
    "uix-navbar__link": {
      _base: "text-gray-600 hover:text-gray-800",
      active: {
        true: "font-bold text-blue-600",
      },
    },
    "uix-navbar__section": "border-b",
    "uix-navbar__section-link": {
      _base: "text-gray-900 hover:text-gray-500 hover:font-bold",
      active: {
        true: "font-bold text-blue-600",
      },
    },
  },
  render() {
    return html`<nav>
      <uix-list vertical spacing="" gap="">
        ${this.items.map((item) => {
          if (item.items?.length) return subNavbarRender(item);
          if (item.href || item.onclick) return linkRender(item);
        })}
      </uix-list>
    </nav> `;
  },
};
