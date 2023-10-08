import {
  ButtonColors,
  ButtonSizes,
  ButtonShapes,
  ButtonVariants,
  Shapes,
  Variants,
  BorderColor,
  Colors,
  Sizes,
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
} from "../style-props.mjs";

const InputField = (props, { html, ifDefined }) =>
  html`
    <uix-input
      .keydown=${props.keydown}
      ?autofocus=${props.autofocus}
      ?disabled=${props.disabled}
      ?required=${props.required}
      name=${props.name}
      value=${ifDefined(props.value)}
      placeholder=${ifDefined(props.placeholder)}
      regex=${ifDefined(props.regex)}
      type=${ifDefined(props.type)}
      maxLength=${ifDefined(props.maxLength)}
      variant=${ifDefined(props.variant)}
      color=${ifDefined(props.color)}
      size=${ifDefined(props.size)}
      class="w-full"
    ></uix-input>
  `;

const TextareaField = (props, { html, ifDefined }) => html`
  <uix-textarea
    .keydown=${props.keydown}
    ?disabled=${props.disabled}
    ?required=${props.required}
    value=${ifDefined(props.value)}
    placeholder=${ifDefined(props.placeholder)}
    rows=${ifDefined(props.rows)}
    variant=${ifDefined(props.variant)}
    color=${ifDefined(props.color)}
    size=${ifDefined(props.size)}
    label=${ifDefined(props.label)}
    labelAlt=${ifDefined(props.labelAlt)}
    class="w-full"
  ></uix-textarea>
`;

const SelectField = (props, { html, ifDefined }) => html`
  <uix-select
    .options=${props.options}
    ?required=${props.required}
    color=${ifDefined(props.color)}
    label=${ifDefined(props.label)}
    altLabel=${ifDefined(props.altLabel)}
    size=${ifDefined(props.size)}
    class="w-full"
  ></uix-select>
`;

const fieldRenderers = {
  input: InputField,
  textarea: TextareaField,
  select: SelectField
};

const renderField = (field, { html, submit, ifDefined }) => {
  const { type, ...props } = field;
  const FieldRenderer = fieldRenderers[type] || fieldRenderers.input;
  const keydown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
    return props.keydown?.(e);
  };

  const fieldComponent = FieldRenderer(
    { ...props, keydown },
    { html, ifDefined }
  );

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
      submit: function () {
        this.renderRoot.querySelector("form").submit();
      },
      render: (host, { html, ifDefined }) => {
        const { fields, actions } = host;
        return html`
          <form>
            ${fields.map((row) => {
    if (Array.isArray(row)) {
      return html`
                  <uix-list responsive>
                    ${row.map(
    (field) =>
      html`<uix-block>
                          ${renderField(field, {
    html,
    submit: host.submit,
    ifDefined
  })}
                        </uix-block>`
  )}
                  </uix-list>
                `;
    } else {
      return renderField(row, {
        html,
        submit: host.submit,
        ifDefined
      });
    }
  })}
            <div class="modal-action">
              <uix-menu responsive gap="md" .items=${actions({ form: host })}>
              </uix-menu>
            </div>
          </form>
        `;
      }
    },
    "uix-form-modal": {
      props: {
        fields: { type: Array, defaultValue: [] },
        actions: { type: Array, defaultValue: [] },
        title: { type: String, defaultValue: "" },
        color: { type: String, defaultValue: "default", enum: Colors },
        size: { type: String, defaultValue: "md", enum: Sizes },
        name: { type: String, defaultValue: "uix-form-modal" },
        position: {
          type: String,
          defaultValue: "middle",
          enum: ["top", "middle", "bottom"]
        },
        icon: { type: String, defaultValue: "" },
        openButton: { type: Function, defaultValue: null },
        closable: { type: Boolean, defaultValue: true }
      },
      render: (host, { html }) => {
        return html`
          <uix-modal
            title=${host.title}
            color=${host.color}
            size=${host.size}
            name=${host.name}
            position=${host.position}
            icon=${host.icon}
            .openButton=${host.openButton}
            .closable=${host.closable}
            .parent=${host}
          >
            <uix-form
              .fields=${host.fields}
              .actions=${({ form }) => host.actions?.({ modal: host, form })}
            ></uix-form>
          </uix-modal>
        `;
      }
    },
    "uix-form-control": {
      props: {
        label: { type: String, defaultValue: null },
        labelAlt: { type: Array, defaultValue: [] }
      },
      render: ({ label, labelAlt }, { html }) => {
        return html`
          <div class="form-control w-full">
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
        placeholder: { type: String, defaultValue: undefined },
        name: { type: String, defaultValue: undefined },
        disabled: { type: Boolean, defaultValue: false },
        regex: { type: String, defaultValue: "" },
        required: { type: Boolean, defaultValue: false },
        type: {
          type: String,
          defaultValue: "text",
          enum: [
            "text",
            "password",
            "email",
            "number",
            "decimal",
            "search",
            "tel",
            "url"
          ]
        },
        maxLength: { type: Number, defaultValue: null },
        variant: { type: String, defaultValue: "bordered", enum: Variants },
        color: { type: String, defaultValue: "default", enum: Colors },
        size: { type: String, defaultValue: "md", enum: Sizes },
        class: "",
        change: {
          type: Function,
          defaultValue: undefined
        },
        keydown: {
          type: Function,
          defaultValue: undefined
        }
      },
      _getValue: function () {
        return this.$input ? this.$input.value : "";
      },
      _setValue: function (value) {
        if (!this.$input) this.$input = this.shadowRoot.querySelector("input");
        this.$input.setAttribute("value", value);
      },
      formAssociated: true,
      init: (host) => {
        host._internals = host.attachInternals();
      },
      render: (host, { html, ifDefined }) => {
        const {
          change,
          name,
          autofocus,
          value,
          placeholder,
          disabled,
          required,
          regex,
          type,
          maxLength,
          variant,
          color,
          size
        } = host;

        const keydown = (e) => {
          host._setValue(e.target.value, host);
          host.keydown?.(e);
        };

        const inputClass = [
          "input",
          InputStyleClass[variant],
          InputVariantClass[color],
          InputSizeClass[size],
          host.class
        ]
          .filter(Boolean)
          .join(" ");

        return html`
          <input
            class=${inputClass}
            .value=${value || ""}
            placeholder=${placeholder}
            ?autofocus=${autofocus}
            ?disabled=${disabled}
            ?required=${required}
            name=${ifDefined(name)}
            regex=${ifDefined(regex)}
            @change=${ifDefined(change)}
            @keydown=${keydown}
            type=${type}
            ${maxLength !== null ? `maxlength=${maxLength}` : ""}
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
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ options, color, size }, { html }) => {
        const colorClass = SelectColors[color];
        const sizeClass = SelectSizes[size];

        return html`
          <select class="select ${colorClass} ${sizeClass} w-full max-w-xs">
            ${options.map((option) => html` <option>${option}</option> `)}
          </select>
        `;
      }
    },

    "uix-textarea": {
      props: {
        value: { type: String, defaultValue: "" },
        placeholder: { type: String, defaultValue: "" },
        disabled: { type: Boolean, defaultValue: false },
        rows: { type: Number, defaultValue: 4 },
        variant: { type: String, defaultValue: "bordered", enum: Variants },
        color: { type: String, defaultValue: "default", enum: Colors },
        size: { type: String, defaultValue: "md", enum: Sizes },
        change: {
          type: Function,
          defaultValue: () => {}
        },
        keydown: {
          type: Function,
          defaultValue: () => {}
        }
      },
      render: (
        {
          keydown,
          change,
          value,
          placeholder,
          disabled,
          rows,
          variant,
          color,
          size
        },
        { html }
      ) => {
        const textareaClass = `textarea ${
          variant === "bordered" ? "textarea-bordered" : ""
        } textarea-${color} textarea-${size}`;

        return html`
          <textarea
            class="${textareaClass}"
            placeholder=${placeholder}
            ?disabled=${disabled}
            rows=${rows}
            @change=${change}
            @keydown=${keydown}
          >
${value}</textarea
          >
        `;
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
      render: ({ on, change, label, disabled, color, size }, { html }) => {
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
          .filter(Boolean)
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
    },

    "uix-button": {
      props: {
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        href: {
          type: String,
          defaultValue: ""
        },
        label: {
          type: String,
          defaultValue: ""
        },
        type: {
          type: String,
          defaultValue: "button"
        },
        fullWidth: { type: Boolean, defaultValue: false },
        shape: {
          type: String,
          defaultValue: "default",
          enum: Shapes
        },
        variant: {
          type: String,
          defaultValue: "",
          enum: Variants
        },
        click: { type: Function, defaultValue: "" },
        isLoading: { type: Boolean, defaultValue: false },
        icon: { type: String, defaultValue: "" },
        endIcon: { type: String, defaultValue: "" },
        border: { type: Boolean, defaultValue: false },
        noAnimation: { type: Boolean, defaultValue: false }
      },
      render: (host, { html }) => {
        const {
          variant,
          type,
          size,
          label,
          click,
          fullWidth,
          border,
          href,
          shape,
          color,
          isLoading,
          icon,
          endIcon,
          noAnimation
        } = host;
        const btnClass = [
          "flex flex-row items-center gap-2",
          href && !variant ? "" : "btn",
          ButtonColors[color] || "",
          (border && BorderColor[color]) || "",
          ButtonSizes[size] || "",
          fullWidth ? "btn-block" : "",
          ButtonShapes[shape] || "",
          ButtonVariants[variant] || "",
          noAnimation ? "no-animation" : ""
        ]
          .filter(Boolean)
          .join(" ");
        const innerContent = [
          icon ? html`<uix-icon name=${icon}></uix-icon>` : "",
          label ? label : html`<slot></slot>`,
          endIcon ? html`<uix-icon name=${endIcon}></uix-icon>` : "",
          isLoading && html`<span class="loading loading-spinner"></span>`
        ];

        return href
          ? html`
              <a
                class=${btnClass}
                href=${href}
                @click=${(event) => click?.({ event, host })}
              >
                ${innerContent}
              </a>
            `
          : html`
              <button
                type=${type || "button"}
                class=${btnClass}
                @click=${(event) => click?.({ event, host })}
              >
                ${innerContent}
              </button>
            `;
      }
    }
  }
};
