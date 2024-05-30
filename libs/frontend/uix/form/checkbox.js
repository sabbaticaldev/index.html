import { css, html, T } from "helpers";

import FormControls from "./form-controls.js";

const Checkbox = {
  tag: "uix-checkbox",
  style: [
    css`
      input[type="checkbox"] {
        clip-path: circle(46% at 50% 50%);
      }
    `,
  ],
  props: {
    name: T.string(),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    checked: T.boolean(),
    value: T.boolean(),
    disabled: T.boolean(),
    change: T.function(),
  },
  ...FormControls("toggle"),
  render() {
    const { checked, change, disabled, name } = this;
    return html`
      <input
        class=${this.theme("uix-checkbox")}
        type="checkbox"
        name=${name}
        @change=${function (e) {
          this.setChecked(e.target.checked);
          change?.(e);
        }}
        ?checked=${checked}
        ?disabled=${disabled}
      />
    `;
  },
  theme: ({ cls, baseTheme, ClipRoundedClasses }) => ({
    "uix-checkbox": {
      _base: cls([
        "before:content[''] peer before:transition-opacity hover:before:opacity-10 checked:opacity-100 opacity-30",
        ClipRoundedClasses[baseTheme.borderRadius],
      ]),
      variant: baseTheme.ReverseVariants,
      size: baseTheme.DimensionSizes,
    },
  }),
};

export default Checkbox;
