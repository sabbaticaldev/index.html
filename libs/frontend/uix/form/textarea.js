import { defaultTheme, genTheme, html, sizeMap, T } from "helpers";

import FormControls from "./form-controls.js";

const TextareaVariants = {
  default: `bg-${defaultTheme.colors.default}-50 border-${defaultTheme.colors.default}-300 focus:ring focus:ring-${defaultTheme.colors.default}-200 focus:border-${defaultTheme.colors.default}-600`,
  primary: `bg-${defaultTheme.colors.primary}-50 border-${defaultTheme.colors.primary}-300 focus:ring focus:ring-${defaultTheme.colors.primary}-200 focus:border-${defaultTheme.colors.primary}-600`,
  secondary: `bg-${defaultTheme.colors.secondary}-50 border-${defaultTheme.colors.secondary}-300 focus:ring focus:ring-${defaultTheme.colors.secondary}-200 focus:border-${defaultTheme.colors.secondary}-600`,
  success: `bg-${defaultTheme.colors.success}-50 border-${defaultTheme.colors.success}-300 focus:ring focus:ring-${defaultTheme.colors.success}-200 focus:border-${defaultTheme.colors.success}-600`,
  danger: `bg-${defaultTheme.colors.error}-50 border-${defaultTheme.colors.error}-300 focus:ring focus:ring-${defaultTheme.colors.error}-200 focus:border-${defaultTheme.colors.error}-600`,
};

const TextareaSizes = ["sm", "md", "lg", "xl"];

const Textarea = {
  tag: "uix-textarea",
  ...FormControls("textarea"),
  props: {
    value: T.string(),
    placeholder: T.string(),
    name: T.string(),
    disabled: T.boolean(),
    required: T.boolean(),
    autofocus: T.boolean(),
    rows: T.number({ defaultValue: 4 }),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    input: T.function(),
    keydown: T.function(),
  },
  _theme: {
    "": "block w-full appearance-none focus:outline-none",
    ".uix-textarea__input": `border-1 w-full h-full block ${
      defaultTheme.borderRadius
    } ${genTheme(
      "variant",
      Object.keys(TextareaVariants),
      (entry) => TextareaVariants[entry],
      { string: true },
    )}`,
    "[&:not([size])]": "p-3",
    ...genTheme("size", TextareaSizes, (entry) =>
      ["w-" + sizeMap[entry], "h-" + sizeMap[entry]].join(" "),
    ),
  },
  render() {
    const {
      autofocus,
      value,
      variant,
      name,
      placeholder,
      disabled,
      rows,
      required,
      keydown,
    } = this;
    return html`
      <textarea
        class="uix-textarea__input"
        placeholder=${placeholder}
        ?disabled=${disabled}
        name=${name}
        rows=${rows}
        variant=${variant}
        ?autofocus=${autofocus}
        ?required=${required}
        @input=${this.change}
        @keydown=${keydown}
      >
        ${value}
      </textarea
      >
    `;
  },
};

export default Textarea;
