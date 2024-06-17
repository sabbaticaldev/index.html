import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, sizeMap, T } from "helpers";

import FormControls from "./form-controls.js";

const FileInputVariants = {
  default: `bg-${defaultTheme.colors.default}-50 border-${defaultTheme.colors.default}-300 focus:ring focus:ring-${defaultTheme.colors.default}-200 focus:border-${defaultTheme.colors.default}-600`,
  primary: `bg-${defaultTheme.colors.primary}-50 border-${defaultTheme.colors.primary}-300 focus:ring focus:ring-${defaultTheme.colors.primary}-200 focus:border-${defaultTheme.colors.primary}-600`,
  secondary: `bg-${defaultTheme.colors.secondary}-50 border-${defaultTheme.colors.secondary}-300 focus:ring focus:ring-${defaultTheme.colors.secondary}-200 focus:border-${defaultTheme.colors.secondary}-600`,
  success: `bg-${defaultTheme.colors.success}-50 border-${defaultTheme.colors.success}-300 focus:ring focus:ring-${defaultTheme.colors.success}-200 focus:border-${defaultTheme.colors.success}-600`,
  danger: `bg-${defaultTheme.colors.error}-50 border-${defaultTheme.colors.error}-300 focus:ring focus:ring-${defaultTheme.colors.error}-200 focus:border-${defaultTheme.colors.error}-600`,
};

const FileInputSizes = ["sm", "base", "lg", "xl"];

const formControlsConfig = FormControls("file");

class FileInput extends ReactiveView {
  static get properties() {
    return {
      accept: T.string(),
      multiple: T.boolean(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
      change: T.function(),
      ...formControlsConfig.props,
    };
  }

  static theme = {
    "": "block w-full appearance-none focus:outline-none",
    ".uix-file-input__input": `flex h-10 w-full border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      defaultTheme.borderRadius
    } ${genTheme(
      "variant",
      Object.keys(FileInputVariants),
      (entry) => FileInputVariants[entry],
      { string: true },
    )}`,
    ...genTheme("size", FileInputSizes, (entry) => [
      "w-" + sizeMap[entry],
      "text-" + entry,
    ]),
  };

  render() {
    return html`
      <input
        class="uix-file-input__input"
        type="file"
        accept=${this.accept}
        ?multiple=${this.multiple}
        variant=${this.variant}
        @change=${this.change}
      />
    `;
  }
}

Object.assign(FileInput, formControlsConfig);

export default ReactiveView.define("uix-file-input", FileInput);
