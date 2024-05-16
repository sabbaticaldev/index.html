import {
  css,
  html,
  ifDefined,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

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
  change: function (e) {
    this._setValue(e.target.value, this);
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
        this.$input,
      );
      //this.reportValidity();
    }, 0);
  },
  formAssociated: true,
  firstUpdated: function () {
    this._defaultValue = this.value;
    this._internals = this.attachInternals();
    if (!this.$input) {
      this.$input = this.q(element || "input");
      if (this.$input) {
        this._internals.setValidity(
          this.$input.validity,
          this.$input.validationMessage,
          this.$input,
        );
      }
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
  },
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
  select: SelectField,
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
    keydown,
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
              </uix-icon>`,
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
        llm: T.object(),
      },
      getForm: function () {
        if (!this.$form) this.$form = this.renderRoot.querySelector("form");
        return this.$form;
      },
      validate: function () {
        const formControls = this.getForm().querySelectorAll(
          "uix-input, uix-select, uix-textarea, uix-file-input",
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
      reset: function () {
        const formControls = this.getForm().querySelectorAll(
          "uix-input, uix-select, uix-textarea, uix-file-input",
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
            form.elements[key].setValue(obj[key]),
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
      render: function () {
        const { fields, actions, method, endpoint, renderField } = this;
        return html`
          <form class="m-0" method=${method} action=${endpoint}>
            <uix-list gap="lg" vertical>
              ${fields.map((field) => renderField(field))}
            </uix-list>
            <uix-list>
              ${actions
    ? html`<uix-list responsive gap="md" class="mx-auto mt-10">
                    ${actions.map(
    (action) => html`<uix-input
                        type=${action.type}
                        @click=${action.click}
                        class=${action.class}
                        value=${action.value}
                      >
                      </uix-input>`,
  )}
                  </uix-list>`
    : ""}
            </uix-list>
          </form>
        `;
      },
    },
    "uix-form-control": {
      props: {
        label: T.string({ type: String, defaultValue: null }),
        labelAlt: T.array({ defaultValue: [] }),
      },
      render: function () {
        const { label, labelAlt } = this;
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
    (alt) => html`<span class="label-text-alt">${alt}</span>`,
  )}
                </label>`
    : ""}
          </div>
        `;
      },
    },
    "uix-input": {
      props: {
        autofocus: T.boolean(),
        value: T.string(),
        placeholder: T.string(),
        name: T.string(),
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
            "url",
          ],
        }),
        maxLength: T.number(),
        variant: T.string({
          defaultValue: "default",
        }),
        size: T.string({
          defaultValue: "md",
        }),
        keydown: T.function(),
      },
      ...FormControls("input"),
      render: function () {
        const {
          name,
          autofocus,
          value,
          change,
          placeholder,
          disabled,
          required,
          regex,
          type,
          keydown,
        } = this;

        return html`
          <div class="relative">
            <input
              type="text"
              id="filled"
              style="line-height: 1.05rem;/*quick hack, should find a better fix*/"
              aria-describedby="filled_success_help"
              class=${this.generateTheme("uix-input")}
              .value=${value || ""}
              ?autofocus=${autofocus}
              ?disabled=${disabled}
              ?required=${required}
              name=${ifDefined(name)}
              regex=${ifDefined(regex)}
              @keydown=${keydown}
              @change=${change}
              type=${type}
              placeholder=" "
            />
            <label for="filled" class=${this.generateTheme("uix-input__label")}>
              ${placeholder}
            </label>
          </div>
        `;
      },
    },
    "uix-select-option": {
      props: {
        value: T.string(),
        label: T.string(),
      },
      render: function () {
        const { value, label } = this;
        return html` <option value=${value}>${label}</option> `;
      },
    },
    "uix-select": {
      ...FormControls("select"),
      props: {
        options: T.array(),
        value: T.string(),
        variant: T.string({ defaultValue: "base" }),
        size: T.string({ defaultValue: "md" }),
        name: T.string(),
      },
      render: function () {
        const { name, options } = this;
        return html`
          <select
            name=${name}
            @change=${this.change}
            class=${this.generateTheme("uix-select")}
          >
            ${(options &&
              options.map((option) => html` <option>${option}</option> `)) ||
            ""}
            <slot></slot>
          </select>
        `;
      },
    },

    "uix-textarea": {
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
      render: function () {
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
            class=${this.generateTheme("uix-textarea")}
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
    },
    "uix-range": {
      props: {
        variant: T.string(),
        min: T.number({ defaultValue: 0 }),
        value: T.number({ defaultValue: 0 }),
        max: T.number({ defaultValue: 100 }),
      },
      ...FormControls("range"),
      render: function () {
        const { generateTheme, min, max, value } = this;
        return html`<div>
          <input
            class=${generateTheme("uix-range")}
            type="range"
            @input=${this.change}
            min=${min}
            max=${max}
            value=${value}
          />
          <div class="-mt-2 flex w-full justify-between">
            <span class="text-sm text-gray-600">Squared</span>
            <span class="text-sm text-gray-600">Rounded</span>
          </div>
        </div>`;
      },
    },

    "uix-checkbox": {
      style: [
        css`
          input[type="checkbox"] {
            // TODO: set borderRadius as a css variable and use here for the border
            clip-path: circle(46% at 50% 50%); /* Set the clip path of circle*/
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
      render: function () {
        const { checked, change, disabled, name } = this;

        return html`
          <input
            class=${this.generateTheme("uix-checkbox")}
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
    },
    "uix-icon-button": {
      props: {
        icon: T.string(),
        variant: T.string(),
        size: T.string(),
        alt: T.string(),
      },
      render: function () {
        const { icon, alt } = this;
        return html`<button
          alt=${alt}
          class=${this.generateTheme("uix-icon-button")}
        >
          <uix-icon
            class=${this.generateTheme("uix-icon-button__icon")}
            name=${icon}
          ></uix-icon>
        </button>`;
      },
    },
    "uix-button": {
      props: {
        size: T.string({ defaultValue: "md" }),
        variant: T.string({ defaultValue: "default" }),
        type: T.string({ defaultValue: "button" }),
        href: T.string(),
        click: T.function(),
        dropdown: T.string(),
      },
      render: function () {
        const { type, click, href, dropdown } = this;
        const btnClass = this.generateTheme("uix-button");
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
                @click=${(event) => click?.({ event, props: this })}
              >
                <slot></slot>
              </a>
            `
          : html`
              <button
                type=${type || "button"}
                class=${btnClass}
                @click=${(event) => click?.({ event, props: this })}
              >
                <slot></slot>
              </button>
            `;
      },
    },
  },
};
