import { css, html, ifDefined, T } from "helpers";

const createFormControl = (tagName) => {
  return (props) => html`
    <${tagName}
      .input=${props.input}
      ?autofocus=${props.autofocus}
      ?disabled=${props.disabled}
      ?required=${props.required}
      name=${props.name}
      value=${ifDefined(props.value)}
      placeholder=${ifDefined(props.placeholder)}
      rows=${ifDefined(props.rows)}
      options=${ifDefined(props.options)}
      color=${ifDefined(props.color)}
      size=${ifDefined(props.size)}
      label=${ifDefined(props.label)}
      labelAlt=${ifDefined(props.labelAlt)}
      containerClass="w-full"
    ></${tagName}>
  `;
};

const InputField = createFormControl("uix-input");
const TextareaField = createFormControl("uix-textarea");
const SelectField = createFormControl("uix-select");

const fieldRenderers = {
  input: InputField,
  textarea: TextareaField,
  select: SelectField,
};

const renderField = (field, host) => {
  const { formType, llm, ...props } = field;
  const FieldRenderer = fieldRenderers[formType] || fieldRenderers.input;
  const keydown = (e) => props.keydown?.(e);

  const fieldComponent = FieldRenderer({ ...props, keydown });

  if (field.label || (field.labelAlt && field.labelAlt.length)) {
    return html`
      <uix-form-control
        .label=${field.label || ""}
        .labelAlt=${llm ? [html`<uix-icon class="cursor-pointer" name="brush-outline" @click=${() => host.wizardForm(field.name)}></uix-icon>`] : field.labelAlt || []}
      >
        ${fieldComponent}
      </uix-form-control>
    `;
  }

  return fieldComponent;
};

const FormControls = (element) => ({
  reportValidity() {
    const validity = this.$input?.reportValidity();
    this.$input?.classList.toggle("input-error", !validity);
    return validity;
  },
  change(e) {
    this._setValue(e.target.value);
  },
  _getValue() {
    return this.$input?.value || "";
  },
  _setValue(value) {
    this.$input.value = value;
    const formData = new FormData();
    formData.append(this.$input.name, value);
    setTimeout(() => {
      this._internals.setFormValue(formData);
      this._internals.setValidity(this.$input.validity, this.$input.validationMessage, this.$input);
    }, 0);
  },
  formAssociated: true,
  firstUpdated() {
    this._defaultValue = this.value;
    this._internals = this.attachInternals();
    this.$input = this.q(element || "input");
    if (this.$input) {
      this._internals.setValidity(this.$input.validity, this.$input.validationMessage, this.$input);
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

const Form = {
  props: {
    fields: T.array(),
    actions: T.array(),
    method: T.string({ defaultValue: "post" }),
    endpoint: T.string(),
    llm: T.object(),
  },
  getForm() {
    if (!this.$form) this.$form = this.renderRoot.querySelector("form");
    return this.$form;
  },
  validate() {
    const formControls = this.getForm().querySelectorAll("uix-input, uix-select, uix-textarea, uix-file-input");
    return Array.from(formControls).every(control => control.reportValidity());
  },
  submit() {
    if (this.validate()) {
      this.getForm().submit();
    }
  },
  reset() {
    const formControls = this.getForm().querySelectorAll("uix-input, uix-select, uix-textarea, uix-file-input");
    formControls.forEach(control => control.formResetCallback?.());
  },
  formData() {
    const formData = new FormData(this.getForm());
    return Object.fromEntries(formData.entries());
  },
  async wizardForm(name) {
    const magicField = this.formData()[name];
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
        Dentist tomorrow 4pm would become:
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
      const obj = JSON.parse(response);
      const form = this.getForm();
      Object.keys(obj).forEach(key => form.elements[key].setValue(obj[key]));
    }
  },
  renderField(row) {
    if (Array.isArray(row)) {
      return html`
        <uix-list>
          ${row.map(field => html`<uix-block spacing="0" class="w-full">${renderField(field, this)}</uix-block>`)}
        </uix-list>
      `;
    } else {
      return renderField(row, this);
    }
  },
  render() {
    const { fields, actions, method, endpoint } = this;
    return html`
      <form class="m-0" method=${method} action=${endpoint}>
        <uix-list gap="lg" vertical>
          ${fields.map(field => renderField(field))}
        </uix-list>
        <uix-list>
          ${actions ? html`
            <uix-list responsive gap="md" class=${this.theme("uix-form-actions")}>
              ${actions.map(action => html`<uix-input type=${action.type} @click=${action.click} class=${action.class} value=${action.value}></uix-input>`)}
            </uix-list>
          ` : ""}
        </uix-list>
      </form>
    `;
  },
};

const FormControl = {
  props: {
    label: T.string({ type: String, defaultValue: null }),
    labelAlt: T.array({ defaultValue: [] }),
  },
  render() {
    const { label, labelAlt } = this;
    return html`
      <div class=${this.theme("uix-form-control")}>
        ${label ? html`<label class=${this.theme("uix-form-control__label")}><span class=${this.theme("uix-form-control__label-text")}>${label}</span></label>` : ""}
        <slot></slot>
        ${labelAlt && labelAlt.length ? html`<label class=${this.theme("uix-form-control__label")}><span class=${this.theme("uix-form-control__label-alt")}>${labelAlt}</span></label>` : ""}
      </div>
    `;
  },
};

const Input = {
  props: {
    autofocus: T.boolean(),
    value: T.string(),
    placeholder: T.string(),
    name: T.string(),
    disabled: T.boolean(),
    regex: T.string(),
    required: T.boolean(),
    type: T.string({ defaultValue: "text", enum: ["text", "password", "email", "number", "decimal", "search", "tel", "url"] }),
    maxLength: T.number(),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    keydown: T.function(),
  },
  ...FormControls("input"),
  render() {
    const { name, autofocus, value, change, placeholder, disabled, required, regex, type, keydown } = this;
    return html`
      <div class="relative">
        <input
          type="text"
          id="filled"
          aria-describedby="filled_success_help"
          class=${this.theme("uix-input")}
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
        <label for="filled" class=${this.theme("uix-input__label")}>
          ${placeholder}
        </label>
      </div>
    `;
  },
};

const SelectOption = {
  props: {
    value: T.string(),
    label: T.string(),
  },
  render() {
    const { value, label } = this;
    return html` <option value=${value}>${label}</option> `;
  },
};

const Select = {
  ...FormControls("select"),
  props: {
    options: T.array(),
    value: T.string(),
    variant: T.string({ defaultValue: "base" }),
    size: T.string({ defaultValue: "md" }),
    name: T.string(),
  },
  render() {
    const { name, options } = this;
    return html`
      <select
        name=${name}
        @change=${this.change}
        class=${this.theme("uix-select")}
      >
        ${(options && options.map(option => html` <option>${option}</option> `)) || ""}
        <slot></slot>
      </select>
    `;
  },
};

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
    const { autofocus, value, name, placeholder, disabled, rows, required, keydown } = this;
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
${value}</textarea>
    `;
  },
};

const Range = {
  props: {
    variant: T.string(),
    min: T.number({ defaultValue: 0 }),
    value: T.number({ defaultValue: 0 }),
    max: T.number({ defaultValue: 100 }),
  },
  ...FormControls("range"),
  render() {
    const { theme, min, max, value } = this;
    return html`
      <div class=${theme("uix-range")}>
        <input
          class=${theme("uix-range__input")}
          type="range"
          @input=${this.change}
          min=${min}
          max=${max}
          value=${value}
        />
        <div class=${theme("uix-range__labels")}>
          <span class="text-sm text-gray-600">Squared</span>
          <span class="text-sm text-gray-600">Rounded</span>
        </div>
      </div>`;
  },
};

const Checkbox = {
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
};

const IconButton = {
  props: {
    icon: T.string(),
    variant: T.string(),
    size: T.string(),
    alt: T.string(),
  },
  render() {
    const { icon, alt } = this;
    return html`<button alt=${alt} class=${this.theme("uix-icon-button")}>
      <uix-icon class=${this.theme("uix-icon-button__icon")} name=${icon}></uix-icon>
    </button>`;
  },
};

const Button = {
  props: {
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    type: T.string({ defaultValue: "button" }),
    href: T.string(),
    click: T.function(),
    dropdown: T.string(),
  },
  render() {
    const { type, click, href, dropdown } = this;
    const btnClass = this.theme("uix-button");
    if (dropdown) {
      return html` <details class="text-left" ?open=${dropdown === "open"}>
        ${(href && html`<summary class=${btnClass}><a href=${href}><slot></slot></a></summary>`) || ""}
        ${(!href && html`<summary class=${btnClass}><slot></slot></summary>`) || ""}
        <slot name="dropdown"></slot>
      </details>`;
    }
    return href
      ? html`
          <a class=${btnClass} href=${href} @click=${(event) => click?.({ event, props: this })}>
            <slot></slot>
          </a>
        `
      : html`
          <button type=${type || "button"} class=${btnClass} @click=${(event) => click?.({ event, props: this })}>
            <slot></slot>
          </button>
        `;
  },
};

const ColorPicker = {
  props: {
    selectedColor: T.string(),
    colors: T.array({ defaultValue: [] }),
    colorKey: T.string(),
    updateTheme: T.function(),
    theme: T.object(),
  },
  render: function () {
    const { selectedColor, colors, colorKey, updateTheme, theme } = this;
    return html`
      <div class="grid grid-cols-14">
        ${colors.map(
    (color) =>
      html`
              <div class="group relative w-6 h-6 cursor-pointer">
                <span
                  @click=${() =>
    updateTheme({
      ...theme,
      colors: { ...theme.colors, [colorKey]: color },
    })}
                  class=${`w-6 h-6 bg-${color}-500 block ${
    color === selectedColor
      ? "scale-110"
      : "hover:scale-110 transform transition ease-out duration-150"
  }`}
                ></span>
                <div
                  class="absolute left-0 mt-1 opacity-0 group-hover:opacity-100 transition  pointer-events-none group-hover:pointer-events-auto"
                >
                  ${Array.from({ length: 9 }, (_, i) => i + 1).map(
    (shade) => html`
                      <span
                        @click=${() =>
    updateTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: color,
      },
    })}
                        class=${`w-6 h-6 block bg-${color}-${shade}00`}
                      ></span>
                    `,
  )}
                </div>
              </div>
            `,
  )}
      </div>
    `;
  },
};

export default {
  i18n: {},
  views: {
    "uix-form": Form,
    "uix-form-control": FormControl,
    "uix-input": Input,
    "uix-select-option": SelectOption,
    "uix-select": Select,
    "uix-textarea": Textarea,
    "uix-range": Range,
    "uix-checkbox": Checkbox,
    "uix-icon-button": IconButton,
    "uix-button": Button,

    "uix-color-picker": ColorPicker,
  },
};
