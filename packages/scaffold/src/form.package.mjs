import {
  Sizes,
  Variants,
  Colors,
  BgColor,
  CheckboxVariant,
  CheckboxSize,
  InputVariantClass,
  InputStyleClass,
  InputSizeClass,
  RadioVariantClass,
  RadioSizeClass,
  FileInputColor,
  FileInputSize,
  RangeColor,
  RangeSize,
  SelectColors,
  SelectSizes,
  ToggleSizeClass,
  ToggleVariantClass
} from "./style-props.mjs";

// Helper function to generate the appropriate component based on the field config
const createFieldComponent = (field, html) => {
  const { type, ...props } = field;

  switch (type) {
  case "input":
    return html`<uix-input .props=${props}></uix-input>`;
  case "textarea":
    return html`<uix-textarea .props=${props}></uix-textarea>`;
  case "select":
    return html`<uix-select .props=${props}></uix-select>`;
    // ... Add more cases as needed for each type of field
  default:
    return html``; // Empty template for unsupported field types
  }
};

const renderField = (field, html) => {
  const fieldComponent = createFieldComponent(field, html);
  if (field.label || (field.labelAlt && field.labelAlt.length)) {
    return html`
      <uix-form-control
        .label=${field.label || ""}
        .labelAlt=${field.labelAlt || []}
      >
        ${fieldComponent}
      </uix-form-control>
    `;
  }
  return fieldComponent;
};

export default {
  i18n: {},
  views: {
    "uix-form": {
      props: {
        fields: {
          type: Array,
          defaultValue: []
        },
        actions: {
          type: Array,
          defaultValue: []
        }
      },
      render: ({ fields, actions }, { html }) => {
        return html`
          <form>
            ${fields.map((row) => {
    if (Array.isArray(row)) {
      // It's a multi-field row
      return html`
                  <uix-list layout="responsive">
                    ${row.map(
    (field) => html`
                        <uix-block> ${renderField(field, html)} </uix-block>
                      `
  )}
                  </uix-list>
                `;
    } else {
      // Single field row
      return renderField(row, html);
    }
  })}
            <uix-menu responsive gap="md" .items=${actions}> </uix-menu>
          </form>
        `;
      }
    },
    "uix-form-control": {
      props: {
        label: { type: String, defaultValue: null },
        labelAlt: { type: Array, defaultValue: [] } // For top-right, bottom-left, bottom-right labels
      },
      render: ({ label, labelAlt }, { html }) => {
        return html`
          <div class="form-control">
            ${label
    ? html`<label class="label"
                  ><span class="label-text">${label}</span></label
                >`
    : ""}
            <slot></slot>
            ${labelAlt && labelAlt.length
    ? html` <label class="label">
                  ${labelAlt.map(
    (alt) => html`<span class="label-text-alt">${alt}</span>`
  )}
                </label>`
    : ""}
          </div>
        `;
      }
    },
    "uix-input": {
      props: {
        autofocus: { type: Boolean, defaultValue: false },
        value: { type: String, defaultValue: "" },
        placeholder: { type: String, defaultValue: "Enter value" },
        disabled: { type: Boolean, defaultValue: false },
        type: {
          type: String,
          defaultValue: "text",
          enum: ["text", "password", "email", "number", "search", "tel", "url"]
        },
        maxLength: { type: Number, defaultValue: null },
        variant: { type: String, defaultValue: "bordered", enum: Variants },
        color: { type: String, defaultValue: "default", enum: Colors },
        size: { type: String, defaultValue: "md", enum: Sizes }
      },
      render: (
        {
          autofocus,
          value,
          placeholder,
          disabled,
          type,
          maxLength,
          variant,
          color,
          size
        },
        { html }
      ) => {
        const inputClass = [
          "input",
          InputStyleClass[variant],
          InputVariantClass[color],
          InputSizeClass[size]
        ]
          .filter((cls) => !!cls)
          .join(" ");

        return html`
          <input
            class="${inputClass}"
            .value=${value || ""}
            placeholder=${placeholder}
            ?autofocus=${autofocus}
            ?disabled=${disabled}
            type=${type}
            ${maxLength !== null ? `maxlength=${maxLength}` : ""}
          />
        `;
      }
    },
    "uix-textarea": {
      props: {
        value: { type: String, defaultValue: "" },
        placeholder: { type: String, defaultValue: "Enter text" },
        disabled: { type: Boolean, defaultValue: false },
        rows: { type: Number, defaultValue: 4 },
        variant: { type: String, defaultValue: "bordered", enum: Variants },
        color: { type: String, defaultValue: "default", enum: Colors },
        size: { type: String, defaultValue: "md", enum: Sizes },
        hasFormControl: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: null },
        labelAlt: { type: Array, defaultValue: [] } // For alt labels
      },
      render: (
        {
          value,
          placeholder,
          disabled,
          rows,
          variant,
          color,
          size,
          hasFormControl,
          label,
          labelAlt
        },
        { html }
      ) => {
        const textareaClass = `textarea ${
          variant === "bordered" ? "textarea-bordered" : ""
        } textarea-${color} textarea-${size}`;

        const textareaElem = html`
          <textarea
            class="${textareaClass}"
            placeholder=${placeholder}
            ?disabled=${disabled}
            rows=${rows}
          >
${value}</textarea
          >
        `;

        if (hasFormControl) {
          return html`
            <div class="form-control">
              ${label
    ? html`<label class="label"
                    ><span class="label-text">${label}</span></label
                  >`
    : ""}
              ${textareaElem}
              ${labelAlt && labelAlt.length
    ? html` <label class="label">
                    ${labelAlt.map(
    (alt) => html`<span class="label-text-alt">${alt}</span>`
  )}
                  </label>`
    : ""}
            </div>
          `;
        } else {
          return textareaElem;
        }
      }
    },
    "uix-file-input": {
      props: {
        acceptedTypes: { type: String, defaultValue: "*/*" },
        multiple: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: null },
        altLabel: { type: String, defaultValue: null },
        color: {
          type: String,
          defaultValue: "neutral",
          enum: Colors
        },
        bordered: { type: Boolean, defaultValue: false },
        ghost: { type: Boolean, defaultValue: false },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        disabled: { type: Boolean, defaultValue: false }
      },
      render: (
        {
          acceptedTypes,
          multiple,
          label,
          altLabel,
          color,
          bordered,
          ghost,
          size,
          disabled
        },
        { html }
      ) => {
        // Base classes
        let inputClasses = "file-input w-full max-w-xs";

        // Add color color
        if (color && Colors.includes(color)) {
          inputClasses += FileInputColor[color];
        }

        // Add bordered style
        if (bordered) {
          inputClasses += " file-input-bordered";
        }

        // Add ghost style
        if (ghost) {
          inputClasses += " file-input-ghost";
        }

        // Add size
        if (size && Sizes.includes(size)) {
          inputClasses += FileInputSize(size);
        }

        // Render
        return html`
          <div class="form-control w-full max-w-xs">
            ${label
    ? html`<label class="label">
                  <span class="label-text">${label}</span>
                  ${altLabel
    ? html`<span class="label-text-alt">${altLabel}</span>`
    : ""}
                </label>`
    : ""}

            <input
              type="file"
              accept=${acceptedTypes}
              ?multiple=${multiple}
              class=${inputClasses}
              ?disabled=${disabled}
            />

            ${altLabel
    ? html`<label class="label">
                  <span class="label-text-alt">${altLabel}</span>
                </label>`
    : ""}
          </div>
        `;
      }
    },
    "uix-range-slider": {
      props: {
        min: { type: Number, defaultValue: 0 },
        max: { type: Number, defaultValue: 100 },
        step: { type: Number, defaultValue: 1 },
        value: { type: Number, defaultValue: 50 },
        color: {
          type: String,
          defaultValue: "neutral",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ min, max, step, value, color, size }, { html }) => {
        const colorClass = RangeColor[color];
        const sizeClass = RangeSize[size];

        return html`
          <input
            type="range"
            min=${min}
            max=${max}
            step=${step}
            value=${value}
            class="range ${colorClass} ${sizeClass} max-w-xs"
          />
        `;
      }
    },
    "uix-select": {
      props: {
        options: { type: Array, defaultValue: [] },
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        },
        label: { type: String, defaultValue: "" },
        altLabel: { type: String, defaultValue: "" },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ options, color, label, altLabel, size }, { html }) => {
        const colorClass = SelectColors[color];
        const sizeClass = SelectSizes[size];

        return html`
          <div class="form-control w-full max-w-xs">
            ${label
    ? html`<label class="label"
                  ><span class="label-text">${label}</span></label
                >`
    : ""}
            <select class="select ${colorClass} ${sizeClass} w-full max-w-xs">
              ${options.map((option) => html` <option>${option}</option> `)}
            </select>
            ${altLabel
    ? html`<label class="label"
                  ><span class="label-text-alt">${altLabel}</span></label
                >`
    : ""}
          </div>
        `;
      }
    },

    "uix-toggle": {
      props: {
        on: { type: Boolean, defaultValue: false },
        indeterminate: { type: Boolean, defaultValue: false },
        color: {
          type: String,
          defaultValue: "default",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        label: { type: String, defaultValue: "Toggle" },
        disabled: { type: Boolean, defaultValue: false },
        change: { type: Function }
      },
      render: (
        { on, indeterminate, change, label, disabled, color, size },
        { html }
      ) => {
        // Handle the indeterminate state.
        const postRender = (el) => {
          const inputEl = el.querySelector("input[type=\"checkbox\"]");
          if (inputEl) inputEl.indeterminate = indeterminate;
        };

        const colorClass = ToggleVariantClass[color] || "";
        const sizeClass = ToggleSizeClass[size];

        return html`
          <div class="form-control w-52">
            <label class="cursor-pointer label">
              <span class="label-text">${label}</span>
              <input
                type="checkbox"
                @change=${change}
                ?checked=${on}
                ?disabled=${disabled}
                class="toggle ${colorClass} ${sizeClass}"
                @postRender=${postRender}
              />
            </label>
          </div>
        `;
      }
    },

    "uix-radio": {
      props: {
        selected: { type: Boolean, defaultValue: false },
        value: { type: String, defaultValue: "" },
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        disabled: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: "" }
      },
      render: ({ selected, value, disabled, color, size, label }, { html }) => {
        const radioClass = [
          "radio",
          RadioVariantClass[color],
          RadioSizeClass[size]
        ]
          .filter((cls) => !!cls)
          .join(" ");

        return html`
          <div class="form-control">
            <label class="cursor-pointer label">
              ${label ? html`<span class="label-text">${label}</span>` : ""}
              <input
                type="radio"
                class=${radioClass}
                value=${value}
                ?checked=${selected}
                ?disabled=${disabled}
              />
            </label>
          </div>
        `;
      }
    },
    "uix-radio-group": {
      props: {
        selectedValue: { type: String, defaultValue: "" },
        options: { type: Array, defaultValue: [] },
        color: {
          type: String,
          defaultValue: "default",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        disabled: { type: Boolean, defaultValue: false },
        withCustomColors: { type: Boolean, defaultValue: false }
      },
      render: (
        { selectedValue, options, disabled, color, size, withCustomColors },
        { html }
      ) => {
        return html`
          <div class="flex flex-col">
            ${options.map(
    (option) => html`
                <uix-radio
                  label=${option.label}
                  value=${option.value}
                  color=${color}
                  size=${size}
                  .selected=${selectedValue === option.value}
                  ?disabled=${disabled}
                  ?withCustomColors=${withCustomColors}
                ></uix-radio>
              `
  )}
          </div>
        `;
      }
    },

    "uix-rating": {
      // TODO: expand daisyUI tags as the JIT can't get dynamic ones
      props: {
        maxValue: { type: Number, defaultValue: 5 },
        value: { type: Number, defaultValue: 0 },
        mask: { type: String, defaultValue: "star", enum: ["star", "heart"] },
        color: {
          type: String,
          defaultValue: "neutral",
          enum: ["orange", "red", "yellow", "lime", "green"]
        },
        size: { type: String, defaultValue: "md", enum: Sizes },
        allowReset: { type: Boolean, defaultValue: false },
        half: { type: Boolean, defaultValue: false }
      },
      render: (
        { maxValue, value, mask, color, size, allowReset, half },
        { html }
      ) => {
        const RatingSizeClasses = {
          lg: "rating-lg",
          md: "rating-md",
          sm: "rating-sm",
          xs: "rating-xs"
        };
        const maskClass =
          mask === "star"
            ? half
              ? "mask-star-2"
              : "mask-star"
            : half
              ? "mask-heart-2"
              : "mask-heart";
        const colorClass = BgColor[color];
        const sizeClass = RatingSizeClasses[size];

        return html`
          <div class="rating ${sizeClass}">
            ${allowReset
    ? html`<input type="radio" name="rating" class="rating-hidden" />`
    : ""}
            ${Array.from({ length: maxValue * (half ? 2 : 1) }).map(
    (_, index) =>
      html`
                  <input
                    type="radio"
                    name="rating"
                    class="mask ${maskClass} ${index < value * (half ? 2 : 1)
  ? colorClass
  : ""} ${half && index % 2 == 0
  ? "mask-half-1"
  : ""} ${half && index % 2 != 0 ? "mask-half-2" : ""}"
                    ${index < value * (half ? 2 : 1) ? "checked" : ""}
                  />
                `
  )}
          </div>
        `;
      }
    },

    "uix-swap": {
      props: {
        isActive: { type: Boolean, defaultValue: false }, // To represent the swap-active state
        isRotated: { type: Boolean, defaultValue: false }, // To represent the swap-rotate effect
        isFlipped: { type: Boolean, defaultValue: false }, // To represent the swap-flip effect
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        }
      },
      render: ({ isActive, isRotated, isFlipped, color }, { html }) => {
        const baseClass = "swap";
        const activeClass = isActive ? "swap-active" : "";
        const rotateClass = isRotated ? "swap-rotate" : "";
        const flipClass = isFlipped ? "swap-flip" : "";
        const bgColorClass = BgColor[color];

        return html`
          <label
            class="${baseClass} ${activeClass} ${rotateClass} ${flipClass}"
          >
            <input type="checkbox" />
            <div class="swap-on ${bgColorClass}">ON</div>
            <div class="swap-off ${bgColorClass}">OFF</div>
          </label>
        `;
      }
    },

    "uix-checkbox": {
      props: {
        checked: { type: Boolean, defaultValue: false },
        indeterminate: { type: Boolean, defaultValue: false },
        color: {
          type: String,
          defaultValue: "default",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        label: { type: String, defaultValue: "" },
        disabled: { type: Boolean, defaultValue: false },
        change: { type: Function }
      },
      render: (
        { checked, indeterminate, change, label, disabled, color, size },
        { html }
      ) => {
        const colorClass = CheckboxVariant[color];
        const sizeClass = CheckboxSize[size];

        const postRender = (el) => {
          const inputEl = el.querySelector("input[type=\"checkbox\"]");
          if (inputEl) inputEl.indeterminate = indeterminate;
        };

        return html`
          <div class="form-control">
            <label class="cursor-pointer label">
              ${(label && html`<span class="label-text">${label}</span>`) || ""}
              <input
                type="checkbox"
                @change=${change}
                ?checked=${checked}
                ?disabled=${disabled}
                class="checkbox ${colorClass} ${sizeClass}"
                @postRender=${postRender}
              />
            </label>
          </div>
        `;
      }
    }
  }
};
