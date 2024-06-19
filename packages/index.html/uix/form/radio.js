import { ReactiveView } from "frontend";

import Checkbox from "./checkbox.js";
import FormControls from "./form-controls.js";

class Radio extends FormControls(Checkbox, "radio") {
  static element = "radio";
}

export default ReactiveView.define("uix-radio", Radio);
