import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import { ifDefined } from "https://esm.sh/lit/directives/if-defined.js";

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
  CheckboxVariant,
  CheckboxSize,
  InputVariantClass,
  TextareaColors,
  TextareaSizes,
  InputStyleClass,
  InputSizeClass,
  RadioVariantClass,
  RadioSizeClass,
  SelectColors,
  SelectSizes
} from "../uix.theme.mjs";

const FormControls = (element) => ({
  reportValidity: function () {
    const validity = this.$input?.reportValidity();
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
      //this.reportValidity();
    }, 0);
  },
  formAssociated: true,
  firstUpdated: function () {
    this._defaultValue = this.value;
    this._internals = this.attachInternals();
    if (!this.$input) {
      this.$input = this.shadowRoot.querySelector(element || "input");
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input
      );
    }
  },
  formResetCallback() {
    if (!["submit", "button", "reset"].includes(this.$input.type))
      this.$input.value = this._defaultValue || "";
  },
  formDisabledCallback(disabled) {
    this.$input.disabled = disabled;
  },
  formStateRestoreCallback(state) {
    this.$input.value = state;
  }
});
const InputField = (props) =>
  html`
    <uix-input
      .input=${props.input}
      ?autofocus=${props.autofocus}
      ?disabled=${props.disabled}
      ?required=${props.required}
      name=${props.name}
      value=${ifDefined(props.value)}
      placeholder=${ifDefined(props.placeholder)}
      regex=${ifDefined(props.regex)}
      type=${ifDefined(props.formType || props.type)}
      maxLength=${ifDefined(props.maxLength)}
      variant=${ifDefined(props.variant)}
      color=${ifDefined(props.color)}
      size=${ifDefined(props.size)}
      containerClass="w-full"
    >
    </uix-input>
  `;

const TextareaField = (props) => html`
  <uix-textarea
    .input=${props.input}
    ?disabled=${props.disabled}
    ?required=${props.required}
    ?autofocus=${props.autofocus}
    value=${ifDefined(props.value)}
    placeholder=${ifDefined(props.placeholder)}
    rows=${ifDefined(props.rows)}
    variant=${ifDefined(props.variant)}
    color=${ifDefined(props.color)}
    size=${ifDefined(props.size)}
    label=${ifDefined(props.label)}
    labelAlt=${ifDefined(props.labelAlt)}
    name=${props.name}
    containerClass="w-full"
  ></uix-textarea>
`;

const SelectField = (props) => html`
  <uix-select
    .options=${props.options}
    ?required=${props.required}
    color=${ifDefined(props.color)}
    label=${ifDefined(props.label)}
    altLabel=${ifDefined(props.altLabel)}
    name=${props.name}
    size=${ifDefined(props.size)}
    containerClass="w-full"
  ></uix-select>
`;

const fieldRenderers = {
  input: InputField,
  textarea: TextareaField,
  select: SelectField
};

const renderField = (field, host) => {
  const { type, formType, llm, ...props } = field;
  const FieldRenderer =
    fieldRenderers[formType || type] || fieldRenderers.input;
  const keydown = (e) => {
    //if (e.key === "Enter") {
    //   host.submit();
    //}
    return props.keydown?.(e);
  };

  const fieldComponent = FieldRenderer({
    ...props,
    type: formType || type,
    keydown
  });

  if (field.label || (field.labelAlt && field.labelAlt.length)) {
    return html`
      <uix-form-control
        .label=${field.label || ""}
        .labelAlt=${llm
    ? [
      html`<uix-icon
                class="cursor-pointer"
                name="brush-outline"
                @click=${() => host.wizardForm(field.name)}
              >
              </uix-icon>`
    ]
    : field.labelAlt || []}
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
        fields: T.array(),
        actions: T.array(),
        method: T.string({ defaultValue: "post" }),
        endpoint: T.string(),
        llm: T.object()
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
      submit: function () {
        if (this.validate()) {
          this.getForm().submit();
        }
      },
      clear: function () {
        const formControls = this.getForm().querySelectorAll(
          "uix-input, uix-select, uix-textarea, uix-file-input"
        );
        formControls.forEach((control) => {
          control.formResetCallback?.();
        });
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
      wizardForm: async function (name) {
        const data = this.formData();
        const magicField = data[name];
        if (magicField) {
          const prompt = `
          Help me create the JSON with an object with the fields:
          Events -
          ${JSON.stringify(this.fields)}
                    
          reply in the format:
          '''
          { prop1: value, prop2: value }
          '''

          only the JSON response, nothing else. 
           
          we have a system that the user can supply a basic summary 
          and we will analyze it, improve and complete the fields based on the description or make assumptions
          for example:
          Dentist tomorrow 4pm would become
          
          would become:
          {
            "summary": "Dentist Appointment",
            "description": "Going to the dentist for a check-up.",
            "cron": "0 20 16 10 ? 2023",
            "duration": 3600000
          }

          Pay attention to the cron format. For summary, reuse and expand and fix the supplied summary.

          Today is ${new Date()}.
          user prompt (summary):
          ${magicField}
          `;
          const response = await this.llm.send(prompt);
          const form = this.getForm();
          const obj = JSON.parse(response);
          Object.keys(obj).forEach((key) =>
            form.elements[key].setValue(obj[key])
          );
        }
      },

      renderField: function (row) {
        if (Array.isArray(row)) {
          return html`
            <uix-list>
              ${row.map((field) => {
    return html`<uix-block spacing="0" class="w-full">
                  ${renderField(field, this)}
                </uix-block>`;
  })}
            </uix-list>
          `;
        } else {
          return renderField(row, this);
        }
      },
      render: (host) => {
        const { fields, actions, method, endpoint } = host;
        const actionList = actions?.({ form: host });
        return html`
          <form class="m-0" method=${method} action=${endpoint}>
            <uix-list gap="lg" vertical>
              ${fields.map((field) => host.renderField(field))}
            </uix-list>
            <uix-list>
              ${actionList
    ? html`<uix-list responsive gap="md" class="mx-auto mt-10">
                    ${actionList.map(
    (action) => html`<uix-input
                        type=${action.type}
                        @click=${action.click}
                        class=${action.class}
                        value=${action.value}
                      >
                      </uix-input>`
  )}
                  </uix-list>`
    : ""}
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
        llm: T.object(),
        method: T.string({ defaultValue: "post" }),
        endpoint: T.string(),
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
              method=${host.method}
              endpoint=${host.endpoint}
              .llm=${host.llm}
              .actions=${({ form }) => host.actions?.({ modal: host, form })}
            ></uix-form>
          </uix-modal>
        `;
      }
    },
    "uix-form-control": {
      props: {
        label: T.string({ type: String, defaultValue: null }),
        labelAlt: T.array({ defaultValue: [] })
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
        containerClass: T.string(),
        change: T.function(),
        keydown: T.function()
      },
      ...FormControls("input"),
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
          variant,
          color,
          size,
          keydown,
          containerClass
        } = host;

        const input = (e) => {
          host._setValue(e.target.value, host);
          host.input?.(e);
        };

        const buttonTypes = ["submit", "reset", "button"];
        const inputClass = [
          "input",
          InputStyleClass[variant],
          InputVariantClass[color],
          InputSizeClass[size],
          buttonTypes.includes(type) && `btn ${ButtonColors[color]}`,
          containerClass
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
            @keydown=${keydown}
            @input=${input}
            type=${type}
          />
        `;
      }
    },

    "uix-select": {
      props: {
        options: T.array(),
        color: T.string({ defaultValue: "base", enum: Colors }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        containerClass: T.string(),
        name: T.string()
      },
      render: ({ containerClass, options, color, size, name }) => {
        const colorClass = SelectColors[color];
        const sizeClass = SelectSizes[size];
        const baseClass = [
          "select",
          colorClass,
          sizeClass,
          "w-full",
          "max-w-xs",
          containerClass
        ]
          .filter(Boolean)
          .join(" ");
        return html`
          <select name=${name} class=${baseClass}>
            ${options.map((option) => html` <option>${option}</option> `)}
          </select>
        `;
      }
    },

    "uix-textarea": {
      props: {
        value: T.string(),
        placeholder: T.string(),
        containerClass: T.string(),
        name: T.string(),
        disabled: T.boolean(),
        required: T.boolean(),
        rounded: T.boolean(),
        autofocus: T.boolean(),
        rows: T.number({ defaultValue: 4 }),
        variant: T.string({ defaultValue: "bordered", enum: Variants }),
        color: T.string({ defaultValue: "default", enum: Colors }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        input: T.function(),
        keydown: T.function()
      },
      ...FormControls("textarea"),
      render: (host) => {
        const {
          rounded,
          autofocus,
          value,
          name,
          placeholder,
          disabled,
          rows,
          variant,
          color,
          size,
          required,
          keydown,
          containerClass
        } = host;

        const input = (e) => {
          host._setValue(e.target.value, host);
          host.input?.(e);
        };
        const textareaClass = [
          "w-full textarea overflow-hidden resize-none",
          variant === "bordered" ? "textarea-bordered" : "",
          rounded ? "" : "rounded-none",
          color ? TextareaColors[color] : "",
          size ? TextareaSizes[size] : "",
          containerClass
        ]
          .filter(Boolean)
          .join(" ");
        return html`
          <textarea
            class=${textareaClass}
            placeholder=${placeholder}
            ?disabled=${disabled}
            name=${name}
            rows=${rows}
            ?autofocus=${autofocus}
            ?required=${required}
            @input=${input}
            @keydown=${keydown}
          >
${value}</textarea
          >
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
    "uix-icon-button": {
      props: {
        icon: T.string(),
        variant: T.string(),
        size: T.string(),
        alt: T.string(),
        containerClass: T.string()
      },
      render: ({ icon, variant, alt, containerClass, size }) => {
        return html` <uix-button
          alt=${alt}
          variant=${variant}
          containerClass=${containerClass}
        >
          <uix-icon size=${size} name=${icon}></uix-icon>
        </uix-button>`;
      }
    },
    "uix-button": {
      props: {
        color: T.string({ defaultValue: "base", enum: Colors }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        href: T.string(),
        containerClass: T.string(),
        type: T.string({ defaultValue: "button" }),
        fullWidth: T.boolean(),
        shape: T.string({ defaultValue: "default", enum: Shapes }),
        variant: T.string({ defaultValue: "", enum: Variants }),
        click: T.function(),
        dropdown: T.string(),
        border: T.boolean(),
        noAnimation: T.boolean()
      },
      render: (host) => {
        const {
          variant,
          type,
          size,
          click,
          fullWidth,
          border,
          href,
          shape,
          color,
          noAnimation,
          dropdown,
          containerClass
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
          noAnimation ? "no-animation" : "",
          dropdown ? "dropdown" : "",
          containerClass
        ]
          .filter(Boolean)
          .join(" ");

        if (dropdown) {
          return html` <details class="text-left" ?open=${dropdown === "open"}>
            ${(href &&
              html`<summary class=${btnClass}>
                <a href=${href}><slot></slot></a>
              </summary>`) ||
            ""}
            ${(!href &&
              html`<summary class=${btnClass}><slot></slot></summary>`) ||
            ""}
            <slot name="dropdown"></slot>
          </details>`;
        }
        return href
          ? html`
              <a
                class=${btnClass}
                href=${href}
                @click=${(event) => click?.({ event, host })}
              >
                <slot></slot>
              </a>
            `
          : html`
              <button
                type=${type || "button"}
                class=${btnClass}
                @click=${(event) => click?.({ event, host })}
              >
                <slot></slot>
              </button>
            `;
      }
    }
  }
};
