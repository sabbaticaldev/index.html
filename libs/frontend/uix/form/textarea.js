import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const Textarea = {
  props: {
    value: T.string(),
    placeholder: T.string(),
    name: T.string(),
    disabled: T.boolean(),
    required: T.boolean(),
    autofocus: T.boolean(),
    rows: T.number({ defaultValue: 4 }),
    variant: T.string({ defaultValue: "bordered" }),
    size: T.string({ defaultValue: "md" }),
    input: T.function(),
    keydown: T.function(),
  },
  ...FormControls("textarea"),
  render() {
    const {
      autofocus,
      value,
      name,
      placeholder,
      disabled,
      rows,
      required,
      keydown,
    } = this;
    return html`
      <textarea
        class=${this.theme("uix-textarea")}
        placeholder=${placeholder}
        ?disabled=${disabled}
        name=${name}
        rows=${rows}
        ?autofocus=${autofocus}
        ?required=${required}
        @input=${this.change}
        @keydown=${keydown}
      >
${value}</textarea
      >
    `;
  },
  theme: ({ cls, userTheme }) => ({
    "uix-textarea": {
      _base: cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        userTheme.defaultTextColor,
        userTheme.borderStyles,
        userTheme.borderWidth,
        userTheme.borderRadius,
      ]),
      active: {
        true: cls([userTheme.activeTextColor, "border-blue-500"]),
        false: cls([userTheme.defaultTextColor, userTheme.hoverBorder]),
      },
      variant: userTheme.BaseVariants,
      size: [userTheme.SpacingSizes, userTheme.TextSizes],
    },
  }),
};

export default Textarea;
