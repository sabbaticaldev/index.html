import { html, ifDefined, T } from "frontend";

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
        .labelAlt=${llm
          ? [
              html`<uix-icon
                class="cursor-pointer"
                name="brush-outline"
                @click=${() => host.wizardForm(field.name)}
              ></uix-icon>`,
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
  tag: "uix-form",
  props: {
    fields: T.array(),
    actions: T.array(),
    method: T.string({ defaultValue: "post" }),
    endpoint: T.string(),
    llm: T.object(),
  },

  theme: {
    "uix-form-actions": "mx-auto mt-10",
  },
  getForm() {
    return this.renderRoot.querySelector("form") || this.$form;
  },
  validate() {
    const formControls = this.getForm().querySelectorAll(
      "uix-input, uix-select, uix-textarea, uix-file-input",
    );
    return [...formControls].every((control) => control.reportValidity());
  },
  submit() {
    // TODO: implement a logic to only submit the form when is a human (the human check could be scrolling, using the mouse, touch content, etc)
    if (this.validate()) {
      this.getForm().submit();
    }
  },
  reset() {
    this.getForm()
      .querySelectorAll("uix-input, uix-select, uix-textarea, uix-file-input")
      .forEach((control) => control.formResetCallback?.());
  },
  formData() {
    return Object.fromEntries(new FormData(this.getForm()));
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
      Object.entries(obj).forEach(([key, value]) => {
        this.getForm().elements[key].setValue(value);
      });
    }
  },
  renderField(row) {
    return Array.isArray(row)
      ? html`
          <uix-container>
            ${row.map(
              (field) => html`
                <uix-container spacing="0" class="w-full">
                  ${renderField(field, this)}
                </uix-container>
              `,
            )}
            <uix-container> </uix-container
          ></uix-container>
        `
      : renderField(row, this);
  },
  render() {
    const { fields, actions, method, endpoint } = this;
    return html`
      <form class="m-0" method=${method} action=${endpoint}>
        <uix-container gap="lg" vertical>
          ${fields.map((field) => this.renderField(field))}
        <uix-container>
        <uix-container>
          ${
            actions
              ? html`
                  <uix-container responsive gap="md" class="uix-form-actions">
                    ${actions.map(
                      (action) => html`
                        <uix-input
                          type=${action.type}
                          @click=${action.click}
                          class=${action.class}
                          value=${action.value}
                        ></uix-input>
                      `,
                    )}
                    <uix-container> </uix-container
                  ></uix-container>
                `
              : ""
          }
        <uix-container>
      </form>
    `;
  },
};
