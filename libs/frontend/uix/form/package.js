import Button from "./button.js";
import Checkbox from "./checkbox.js";
import ColorPicker from "./color-picker.js";
import Form from "./form.js";
import FormControl from "./form-control.js";
import IconButton from "./icon-button.js";
import Input from "./input.js";
import Range from "./range.js";
import { Select, SelectOption } from "./select.js";
import Textarea from "./textarea.js";

export default {
  i18n: {},
  views: {
    "uix-form": Form,
    "uix-form-control": FormControl,
    "uix-input": Input,
    "uix-textarea": Textarea,
    "uix-range": Range,
    "uix-checkbox": Checkbox,
    "uix-select-option": SelectOption,
    "uix-select": Select,
    "uix-icon-button": IconButton,
    "uix-button": Button,
    "uix-color-picker": ColorPicker,
  },
};
