import Button from "./button.js";
import Checkbox from "./checkbox.js";
import CheckboxGroup from "./checkbox-group.js";
import ColorPicker from "./color-picker.js";
import DateInput from "./date-input.js";
import FileInput from "./file-input.js";
import Form from "./form.js";
import FormControl from "./form-control.js";
import IconButton from "./icon-button.js";
import Input from "./input.js";
import NumberInput from "./number-input.js";
import RadioGroup from "./radio-group.js";
import Range from "./range.js";
import { Select, SelectOption } from "./select.js";
import Switch from "./switch.js";
import Textarea from "./textarea.js";
import TimeInput from "./time-input.js";

export default {
  i18n: {},
  views: {
    "uix-form": Form,
    "uix-form-control": FormControl,
    "uix-input": Input,
    "uix-textarea": Textarea,
    "uix-range": Range,
    "uix-checkbox": Checkbox,
    "uix-checkbox-group": CheckboxGroup,
    "uix-radio-group": RadioGroup,
    "uix-select-option": SelectOption,
    "uix-select": Select,
    "uix-icon-button": IconButton,
    "uix-button": Button,
    "uix-color-picker": ColorPicker,
    "uix-switch": Switch,
    "uix-file-input": FileInput,
    "uix-number-input": NumberInput,
    "uix-date-input": DateInput,
    "uix-time-input": TimeInput,
  },
};
