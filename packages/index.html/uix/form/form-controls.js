const FormControlsMixin = (Base, element) => {
  return class FormControls extends Base {
    static formAssociated = true;

    reportValidity() {
      const validity = this.$input?.reportValidity();
      this.$input?.classList.toggle("input-error", !validity);
      return validity;
    }

    change(e) {
      this._setValue(e.target.value);
    }

    _getValue() {
      return this.$input?.value || "";
    }

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
    }

    firstUpdated() {
      super.firstUpdated();
      this._defaultValue = this.value;
      if (!this._internals) this._internals = this.attachInternals();
      if (!this.$input)
        this.$input = this.q(
          ["select", "textarea"].includes(element) ? element : "input",
        );
      if (this.$input) {
        this._internals.setValidity(
          this.$input.validity,
          this.$input.validationMessage,
          this.$input,
        );
      }
    }

    formResetCallback() {
      if (!["submit", "button", "reset"].includes(this.$input.type))
        this.$input.value = this._defaultValue || "";
    }

    formDisabledCallback(disabled) {
      if (this.$input) this.$input.disabled = disabled;
    }

    formStateRestoreCallback(state) {
      if (this.$input) this.$input.value = state;
    }
  };
};

export default FormControlsMixin;
