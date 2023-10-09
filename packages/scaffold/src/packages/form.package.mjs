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

const FormControls = {
  reportValidity: function () {
    const validity = this.$input.reportValidity();
    if (!validity) {
      //this.$input.setCustomValidity("");
      this.$input.classList.add("input-error");
    } else {
      this.$input.classList.remove("input-error");
    }
    return validity;
  },
  _getValue: function () {
    return this.$input ? this.$input.value : "";
  },
  _setValue: function (value) {
    this.$input.value = value;
    let formData = new FormData();
    const name = this.$input.name;
    formData.append(name, value);

    setTimeout(() => {
      this._internals.setFormValue(formData);
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input
      );
      this.reportValidity();
    }, 0);
  },
  formAssociated: true,
  init: (host) => {
    host._defaultValue = host.value;
    host._internals = host.attachInternals();
  },
  firstUpdated(host) {
    if (!host.$input) {
      host.$input = host.shadowRoot.querySelector("input");
      host._internals.setValidity(
        host.$input.validity,
        host.$input.validationMessage,
        host.$input
      );
    }
  },
  formResetCallback() {
    this.$input.value = this._defaultValue;
  },
  formDisabledCallback(disabled) {
    this.$input.disabled = disabled;
  },
  formStateRestoreCallback(state) {
    this.$input.value = state;
  }
};

export default ({ T, html, ifDefined }) => {
  const InputField = (props) =>
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

  const TextareaField = (props) => html`
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

  const SelectField = (props) => html`
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

  const renderField = (field, { submit }) => {
    const { type, ...props } = field;
    const FieldRenderer = fieldRenderers[type] || fieldRenderers.input;
    const keydown = (e) => {
      if (e.key === "Enter") {
        submit();
      }
      return props.keydown?.(e);
    };

    const fieldComponent = FieldRenderer({ ...props, keydown });

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

  return {
    i18n: {},
    views: {
      "uix-form": {
        props: {
          fields: T.array(),
          actions: T.array()
        },
        getForm: function () {
          if (!this.$form) this.$form = this.renderRoot.querySelector("form");
          return this.$form;
        },
        validate: function () {
          const formControls = this.getForm().querySelectorAll(
            "uix-input, uix-select, uix-textarea, uix-file-input"
          );
          let isFormValid = true;
          formControls.forEach((control) => {
            if (!control.reportValidity()) {
              isFormValid = false;
            }
          });

          return isFormValid;
        },
        formData: function () {
          const form = this.getForm();
          const formData = new FormData(form);
          const data = {};
          formData.forEach((value, key) => {
            data[key] = value;
          });
          return data;
        },
        render: (host) => {
          const { fields, actions } = host;
          return html`
            <form class="m-0">
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
              <uix-list>
                <uix-menu
                  responsive
                  gap="md"
                  class="mx-auto mt-10"
                  .items=${actions({ form: host })}
                >
                </uix-menu>
              </uix-list>
            </form>
          `;
        }
      },
      "uix-form-modal": {
        props: {
          fields: T.array(),
          actions: T.array(),
          title: T.string(),
          color: T.string({ defaultValue: "default", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          name: T.string({ defaultValue: "uix-form-modal" }),
          position: T.string({
            defaultValue: "middle",
            enum: ["top", "middle", "bottom"]
          }),
          icon: T.string({ defaultValue: "" }),
          openButton: T.function({}),
          closable: T.boolean({ defaultValue: true })
        },
        render: (host) => {
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
        render: ({ label, labelAlt }) => {
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
          autofocus: T.boolean(),
          value: T.string(),
          placeholder: T.string({ defaultValue: undefined }),
          name: T.string({ defaultValue: undefined }),
          disabled: T.boolean(),
          regex: T.string(),
          required: T.boolean(),
          type: T.string({
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
          }),
          maxLength: T.number(),
          variant: T.string({
            defaultValue: "bordered",
            enum: Variants
          }),
          color: T.string({
            defaultValue: "default",
            enum: Colors
          }),
          size: T.string({
            defaultValue: "md",
            enum: Sizes
          }),
          class: T.string(),
          change: T.function(),
          keydown: T.function()
        },
        ...FormControls,
        render: (host) => {
          const {
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

          const change = (e) => {
            host._setValue(e.target.value, host);
            host.change?.(e);
          };

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
              @change=${change}
              @keydown=${keydown}
              type=${type}
              ${maxLength !== null ? `maxlength=${maxLength}` : ""}
            />
          `;
        }
      },

      "uix-select": {
        props: {
          options: T.array(),
          color: T.string({ defaultValue: "base", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes })
        },
        render: ({ options, color, size }) => {
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
          value: T.string(),
          placeholder: T.string(),
          disabled: T.boolean(),
          rows: T.number({ defaultValue: 4 }),
          variant: T.string({ defaultValue: "bordered", enum: Variants }),
          color: T.string({ defaultValue: "default", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          change: T.function(),
          keydown: T.function()
        },
        render: ({
          keydown,
          change,
          value,
          placeholder,
          disabled,
          rows,
          variant,
          color,
          size
        }) => {
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
          acceptedTypes: T.string({ defaultValue: "*/*" }),
          multiple: T.boolean(),
          label: T.string({ defaultValue: null }),
          altLabel: T.string({ defaultValue: null }),
          color: T.string({ defaultValue: "neutral", enum: Colors }),
          bordered: T.boolean(),
          ghost: T.boolean(),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          disabled: T.boolean()
        },
        render: ({
          acceptedTypes,
          multiple,
          label,
          altLabel,
          color,
          bordered,
          ghost,
          size,
          disabled
        }) => {
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
          min: T.number({ defaultValue: 0 }),
          max: T.number({ defaultValue: 100 }),
          step: T.number({ defaultValue: 1 }),
          value: T.number({ defaultValue: 50 }),
          color: T.string({ defaultValue: "neutral", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes })
        },
        render: ({ min, max, step, value, color, size }) => {
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
          on: T.boolean(),
          indeterminate: T.boolean(),
          color: T.string({ defaultValue: "default", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          label: T.string({ defaultValue: "Toggle" }),
          disabled: T.boolean(),
          change: T.function()
        },
        render: ({ on, change, label, disabled, color, size }) => {
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
          selected: T.boolean(),
          value: T.string(),
          color: T.string({ defaultValue: "", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          disabled: T.boolean(),
          label: T.string()
        },
        render: ({ selected, value, disabled, color, size, label }) => {
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
          selectedValue: T.string(),
          options: T.array(),
          color: T.string({ defaultValue: "default", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          disabled: T.boolean(),
          withCustomColors: T.boolean()
        },
        render: ({
          selectedValue,
          options,
          disabled,
          color,
          size,
          withCustomColors
        }) => {
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
          maxValue: T.number({ defaultValue: 5 }),
          value: T.number({ defaultValue: 0 }),
          mask: T.string({ defaultValue: "star", enum: ["star", "heart"] }),
          color: T.string({
            defaultValue: "neutral",
            enum: ["orange", "red", "yellow", "lime", "green"]
          }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          allowReset: T.boolean(),
          half: T.boolean()
        },
        render: ({ maxValue, value, mask, color, size, allowReset, half }) => {
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
    ? html`<input
                    type="radio"
                    name="rating"
                    class="rating-hidden"
                  />`
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
          isActive: T.boolean(),
          isRotated: T.boolean(),
          isFlipped: T.boolean(),
          color: T.string({ defaultValue: "base", enum: Colors })
        },
        render: ({ isActive, isRotated, isFlipped, color }) => {
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
          checked: T.boolean(),
          indeterminate: T.boolean(),
          color: T.string({ defaultValue: "default", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          label: T.string(),
          disabled: T.boolean(),
          change: T.function()
        },
        render: ({
          checked,
          indeterminate,
          change,
          label,
          disabled,
          color,
          size
        }) => {
          const colorClass = CheckboxVariant[color];
          const sizeClass = CheckboxSize[size];

          const postRender = (el) => {
            const inputEl = el.querySelector("input[type=\"checkbox\"]");
            if (inputEl) inputEl.indeterminate = indeterminate;
          };

          return html`
            <div class="form-control">
              <label class="cursor-pointer label">
                ${(label && html`<span class="label-text">${label}</span>`) ||
                ""}
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
          color: T.string({ defaultValue: "base", enum: Colors }),
          size: T.string({ defaultValue: "md", enum: Sizes }),
          href: T.string(),
          label: T.string(),
          type: T.string({ defaultValue: "button" }),
          fullWidth: T.boolean(),
          shape: T.string({ defaultValue: "default", enum: Shapes }),
          variant: T.string({ defaultValue: "", enum: Variants }),
          click: T.function(),
          isLoading: T.boolean(),
          icon: T.string(),
          endIcon: T.string(),
          border: T.boolean(),
          noAnimation: T.boolean()
        },
        render: (host) => {
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
};
