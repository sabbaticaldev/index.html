import { ReactiveView } from "frontend";

import FormControls from "./form-controls.js";

const formControlsConfig = FormControls("checkbox");

class Checkbox extends ReactiveView {
  static get properties() {
    return formControlsConfig.props;
  }
}

Object.assign(Checkbox, formControlsConfig);

export default ReactiveView.define("uix-checkbox", Checkbox);
