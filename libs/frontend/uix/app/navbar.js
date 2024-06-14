import { html, T } from "helpers"; 

const linkRender = (item) =>
  html`
    <uix-link
      href=${item.href}
      .onclick=${item.onclick}
      data-theme="uix-navbar__link"
      size="xs"
      ?active=${item.active}
    >
      ${renderLabel(item)}
    </uix-link>
  `;
const renderLabel = (item) => html` <uix-container
  items="center"
  horizontal
  gap="sm"
>
  ${item.icon ? html`<uix-icon name=${item.icon}></uix-icon>` : ""}
  ${item.label}
</uix-container>`;
const subNavbarRender = (item) =>
  item.variant === "accordion"
    ? accordionRender(item)
    : html` 
        <uix-text size="xs" transform="uppercase">
          ${renderLabel(item)}
        </uix-text>
        <uix-navbar .items=${item.items}></uix-navbar>
      `;

const accordionRender = (item) => html`
  <uix-accordion ?border=${item.border} ?multiple=${item.multiple}>
    ${item.items.map((item) => html` <uix-accordion-item
      label=${item.label}
      icon=${item.icon}
      ?open=${item.open}
    >
    ${linkRender(item)}
    </uix-accordion-item>`)}

  </uix-accordion>
`;
export default {
  tag: "uix-navbar",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        icon: T.string(),
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
  _theme: {
    "uix-navbar__link": {
      _base: "block text-gray-600 hover:bg-gray-500 hover:text-white",
      active: {
        true: "font-bold text-blue-600",
      },
    },
    "uix-navbar__header": "px-2 pt-2",
    "uix-navbar__section": "border-b",
  },
  render() {
    return html`<nav>
      <uix-container padding="sm">
        ${this.items.map((item) => {
          if (item.href || item.onclick) return linkRender(item);
          else return subNavbarRender(item);
        })}
      </uix-container>
    </nav> `;
  },
};
