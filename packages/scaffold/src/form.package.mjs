import {
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {    
    
    "uix-input": {
      props: {
        autofocus: { type: Boolean, defaultValue: false },
        value: { type: String, defaultValue: "" },
        placeholder: { type: String, defaultValue: "Enter value" },
        disabled: { type: Boolean, defaultValue: false },
        type: { type: String, defaultValue: "text", enum: ["text", "password", "email", "number", "search"] },
        maxLength: { type: Number, defaultValue: null },
        change: {type: Function, defaultValue: null },
        keyup: { type: Function, defaultValue: null },
        style: { type: String, defaultValue: "bordered", enum: Styles },
        variant: { type: String, defaultValue: "default", enum: Variants },
        size: { type: String, defaultValue: "md", enum: Sizes },
        hasFormControl: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: null },
        labelAlt: { type: Array, defaultValue: [] }, // For top-right, bottom-left, bottom-right labels
      },
      render: ({ autofocus, value, keyup, placeholder, disabled, type, maxLength, style, variant, size, hasFormControl, label, labelAlt }, { html }) => {      
        const InputVariantClass = {
          "primary": "input-primary",
          "secondary": "input-secondary",
          "accent": "input-accent",
          "neutral": "input-neutral",
          "base": "input-base",
          "info": "input-info",
          "success": "input-success",
          "warning": "input-warning",
          "error": "input-error"
        };

        const InputStyleClass = {
          "ghost": "input-ghost",
          "link": "input-link",
          "outline": "input-outline",
          "glass": "input-glass",
          "active": "input-active",
          "disabled": "input-disabled",
          "bordered": "input-bordered"
        };
      
        const InputSizeClass = {
          "lg": "input-lg",
          "md": "input-md",
          "sm": "input-sm",
          "xs": "input-xs"
        };

        const inputClass = ["input", InputStyleClass[style], InputVariantClass[variant],InputSizeClass[size]].filter(cls=>!!cls).join(" ");
        
        const inputElem = html`
        <input 
          class="${inputClass}" 
          @keyup=${keyup}
          .value=${value || ""}
          placeholder=${placeholder} 
          ?autofocus=${autofocus}
          ?disabled=${disabled} 
          type=${type} 
          ${maxLength !== null ? `maxlength=${maxLength}` : ""}>
      `;
  
        if (hasFormControl) {
          return html`
          <div class="form-control">
            ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
            ${inputElem}
            ${labelAlt && labelAlt.length ? html`<label class="label">
              ${labelAlt[0] ? html`<span class="label-text-alt">${labelAlt[0]}</span>` : ""}
              ${labelAlt[1] ? html`<span class="label-text-alt">${labelAlt[1]}</span>` : ""}
            </label>` : ""}
          </div>
        `;
        }
  
        return inputElem;
      },
    },
    "uix-textarea": {
      props: {
        value: { type: String, defaultValue: "" },
        placeholder: { type: String, defaultValue: "Enter text" },
        disabled: { type: Boolean, defaultValue: false },
        rows: { type: Number, defaultValue: 4 },
        variant: { type: String, defaultValue: "bordered", enum: Styles },
        color: { type: String, defaultValue: "default", enum: Variants },
        size: { type: String, defaultValue: "md", enum: Sizes },
        hasFormControl: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: null },
        labelAlt: { type: Array, defaultValue: [] } // For alt labels
      },
      render: ({ value, placeholder, disabled, rows, variant, color, size, hasFormControl, label, labelAlt }, { html }) => {
      
        const textareaClass = `textarea ${variant === "bordered" ? "textarea-bordered" : ""} textarea-${color} textarea-${size}`;
  
        const textareaElem = html`
        <textarea 
          class="${textareaClass}" 
          placeholder=${placeholder} 
          ?disabled=${disabled} 
          rows=${rows}>${value}</textarea>
      `;
  
        if (hasFormControl) {
          return html`
          <div class="form-control">
            ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
            ${textareaElem}
            ${labelAlt && labelAlt.length ? html`
              <label class="label">
                ${labelAlt.map(alt => html`<span class="label-text-alt">${alt}</span>`)}
              </label>` : ""}
          </div>
        `;
        } else {
          return textareaElem;
        }
      },
    },  
    "uix-file-input": {
      props: {
        acceptedTypes: { type: String, defaultValue: "*/*" },
        multiple: { type: Boolean, defaultValue: false },
        label: { type: String, defaultValue: null },
        altLabel: { type: String, defaultValue: null },
        variant: {
          type: String,
          defaultValue: "neutral",
          enum: Variants
        },
        bordered: { type: Boolean, defaultValue: false },
        ghost: { type: Boolean, defaultValue: false },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        disabled: { type: Boolean, defaultValue: false }
      },
      render: ({ acceptedTypes, multiple, label, altLabel, variant, bordered, ghost, size, disabled }, { html }) => {
      
        const FileInputColor = {
          "primary": "file-input-primary",
          "secondary": "file-input-secondary",
          "accent": "file-input-accent",
          "neutral": "file-input-neutral",
          "base": "file-input-base",
          "info": "file-input-info",
          "success": "file-input-success",
          "warning": "file-input-warning",
          "error": "file-input-error"
        };
        const FileInputSize = {
          "lg": "file-input-lg",
          "md": "file-input-md",
          "sm": "file-input-sm",
          "xs": "file-input-xs"
        };
        // Base classes
        let inputClasses = "file-input w-full max-w-xs";
      
        // Add variant color
        if (variant && Variants.includes(variant)) {
          inputClasses += FileInputColor[variant];
        }
      
        // Add bordered style
        if (bordered) {
          inputClasses += " file-input-bordered";
        }
      
        // Add ghost style
        if (ghost) {
          inputClasses += " file-input-ghost";
        }
  
        // Add size
        if (size && Sizes.includes(size)) {
          inputClasses += FileInputSize(size);
        }
  
        // Render
        return html`
        <div class="form-control w-full max-w-xs">
          ${label ? html`<label class="label">
            <span class="label-text">${label}</span>
            ${altLabel ? html`<span class="label-text-alt">${altLabel}</span>` : ""}
          </label>` : ""}
          
          <input type="file" accept=${acceptedTypes} ?multiple=${multiple} class=${inputClasses} ?disabled=${disabled} />
          
          ${altLabel ? html`<label class="label">
            <span class="label-text-alt">${altLabel}</span>
          </label>` : ""}
        </div>
      `;
      },
    },
    "uix-range-slider": {
      props: {
        min: { type: Number, defaultValue: 0 },
        max: { type: Number, defaultValue: 100 },
        step: { type: Number, defaultValue: 1 },
        value: { type: Number, defaultValue: 50 },
        variant: {
          type: String,
          defaultValue: "neutral",
          enum: Variants
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ min, max, step, value, variant, size }, { html }) => {
        const RangeColor = {
          "primary": "range-primary",
          "secondary": "range-secondary",
          "accent": "range-accent",
          "neutral": "range-neutral",
          "base": "range-base",
          "info": "range-info",
          "success": "range-success",
          "warning": "range-warning",
          "error": "range-error"
        };

        const RangeSize = {
          "lg": "range-lg",
          "md": "range-md",
          "sm": "range-sm",
          "xs": "range-xs"
        };

        const colorClass = RangeColor[variant];
        const sizeClass = RangeSize[size];
  
        return html`
        <input type="range" 
               min=${min} 
               max=${max} 
               step=${step} 
               value=${value} 
               class="range ${colorClass} ${sizeClass} max-w-xs"
        />
      `;
      },
    },
    "uix-select": {
      props: {
        options: { type: Array, defaultValue: [] },
        variant: { 
          type: String, 
          defaultValue: "base",
          enum: Variants 
        },
        label: { type: String, defaultValue: "" },
        altLabel: { type: String, defaultValue: "" },
        size: { 
          type: String, 
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ options, variant, label, altLabel, size }, { html }) => {
        const SelectColors = {
          "primary": "select-primary",
          "secondary": "select-secondary",
          "accent": "select-accent",
          "neutral": "select-neutral",
          "base": "select-base",
          "info": "select-info",
          "success": "select-success",
          "warning": "select-warning",
          "error": "select-error"
        };
        const SelectSizes = {
          "lg": "select-lg",
          "md": "select-md",
          "sm": "select-sm",
          "xs": "select-xs"
        };      
        const variantClass =  SelectColors[variant];
        const sizeClass = SelectSizes[size];
      
        return html`
        <div class="form-control w-full max-w-xs">
          ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
          <select class="select ${variantClass} ${sizeClass} w-full max-w-xs">
            ${options.map(option => html`
              <option>${option}</option>
            `)}
          </select>
          ${altLabel ? html`<label class="label"><span class="label-text-alt">${altLabel}</span></label>` : ""}
        </div>
      `;
      }
    },  

    "uix-toggle": {
      props: {
        on: { type: Boolean, defaultValue: false },
        indeterminate: { type: Boolean, defaultValue: false },
        variant: {
          type: String,
          defaultValue: "default",
          enum: Variants
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes 
        },
        label: { type: String, defaultValue: "Toggle" },
        disabled: { type: Boolean, defaultValue: false },
        change: { type: Function }
      },
      render: ({ on, indeterminate, change, label, disabled, variant, size }, { html }) => {
        const ToggleVariantClass = {
          "primary": "toggle-primary",
          "secondary": "toggle-secondary",
          "accent": "toggle-accent",
          "neutral": "toggle-neutral",
          "base": "toggle-base",
          "info": "toggle-info",
          "success": "toggle-success",
          "warning": "toggle-warning",
          "error": "toggle-error"
        };
      
        const ToggleSizeClass = {
          "md": "toggle-md",
          "sm": "toggle-sm",
          "lg": "toggle-lg",
          "xs": "toggle-xs"
        };


        // Handle the indeterminate state.
        const postRender = (el) => {
          const inputEl = el.querySelector("input[type=\"checkbox\"]");
          if (inputEl) inputEl.indeterminate = indeterminate;
        };
  
        const variantClass = ToggleVariantClass[variant] || "";
        const sizeClass = ToggleSizeClass[size];
  
        return html`
        <div class="form-control w-52">
          <label class="cursor-pointer label">
            <span class="label-text">${label}</span>
            <input 
              type="checkbox" 
              @change=${change} 
              ?checked=${on} 
              ?disabled=${disabled} 
              class="toggle ${variantClass} ${sizeClass}"
              @postRender=${postRender}
            >
          </label>
        </div>
      `;
      },
    },
  }
};
      