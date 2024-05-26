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
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input,
      );
    }, 0);
  },
  formAssociated: true,
  firstUpdated() {
    this._defaultValue = this.value;
    this._internals = this.attachInternals();
    this.$input = this.q(element || "input");
    if (this.$input) {
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input,
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
  },
});

export default FormControls;
