const Triggers = ["click", "hover"];
const Directions = ["horizontal", "vertical"];
const Positions = ["top", "bottom", "left", "right", "top-right", "top-left", "bottom-right", "bottom-left"];
const Formats = ["DHMS", "HMS", "MS", "S"];
const Sizes = ["sm", "md", "lg"];
const IndicatorsFormat = ["percentage", "absolute"];
const Variants = ["primary", "secondary", "accent", "neutral", "base", "info", "success", "warning", "error"];

export default {
  "uix-divider": {
    props: {
      thickness: { type: String, defaultValue: "1px" },
      color: {
        type: String, 
        defaultValue: "primary",
        enum: Variants,
      },
    },
    render: ({ thickness, color }, { html }) => {
      return html`<hr class="border-t border-${color}-500" style="border-top-width: ${thickness};">`;
    },
  },    
      
  "uix-avatar": {
    props: {
      src: { type: String, required: true },
      alt: { type: String, defaultValue: "User Avatar" },
      size: {
        type: String, 
        defaultValue: "md",
        enum: Sizes
      },
    },
    render: ({ src, alt, size }, { html }) => {
      const sizeClass = size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-14 h-14";
      return html`<img src="${src}" alt="${alt}" class="rounded-full ${sizeClass}">`;
    },
  },
      
  "uix-link": {
    props: {
      href: { type: String, defaultValue: "#" },
      content: { type: String, defaultValue: "Link" },
      external: { type: Boolean, defaultValue: false },
    },
    render: ({ href, content, external }, { html }) => {
      return html`<a href="${href}" class="text-primary-500 hover:underline" ${external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${content}</a>`;
    },
  },
      
  "uix-kbd": {
    props: {
      keyContent: { type: String, defaultValue: "Key" },
      combo: { type: Boolean, defaultValue: false },
    },
    render: ({ keyContent, combo }, { html }) => {
      const kbdClass = `bg-primary-200 rounded px-2 py-1 ${combo ? "border border-primary-300" : ""}`;
      return html`<kbd class="${kbdClass}">${keyContent}</kbd>`;
    },
  },
      
  "uix-hero": {
    props: {
      title: { type: String, defaultValue: "Hero Title" },
      subtitle: { type: String, defaultValue: "Subtitle" },
      backgroundImage: { type: String, defaultValue: "" },
    },
    render: ({ title, subtitle, backgroundImage }, { html }) => {
      const heroClass = backgroundImage ? "bg-cover bg-center" : "bg-primary-200";
      return html`
              <div class="${heroClass}" style="background-image: url('${backgroundImage}');">
                <div class="text-center p-10">
                  <h1 class="text-4xl font-bold text-primary-700">${title}</h1>
                  <p class="text-xl text-primary-600">${subtitle}</p>
                </div>
              </div>
            `;
    },
  },

  "uix-button": {
    props: {
      label: { type: String, defaultValue: "Button" },
      variant: { type: String, defaultValue: "default", enum: Variants },
      size: { type: String, defaultValue: "md", enum: Sizes },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ label, variant, size, disabled }, { html }) => {
      return html`<button class="btn btn-${variant} btn-${size}" ?disabled="${disabled}">${label}</button>`;
    },
  },

  "uix-checkbox": {
    props: {
      checked: { type: Boolean, defaultValue: false },
      variant: { type: String, defaultValue: "default", enum: Variants },
      label: { type: String, defaultValue: "Checkbox" },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ checked, label, disabled, variant }, { html }) => {
      return html`
        <label class="flex items-center">
          <input type="checkbox" ?checked="${checked}" ?disabled="${disabled}" class="checkbox checkbox-${variant}">
          <span class="ml-2">${label}</span>
        </label>
      `;
    },
  },

  "uix-toggle": {
    props: {
      on: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: "Toggle" },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ on, label, disabled }, { html }) => {
      return html`
        <label class="flex items-center">
          <input type="checkbox" ?checked="${on}" ?disabled="${disabled}" class="toggle">
          <span class="ml-2">${label}</span>
        </label>
      `;
    },
  },

  "uix-mask": {
    props: {
      content: { type: String, defaultValue: "Masked Content" }
    },
    render: ({ content }, { html }) => {
      // Placeholder for masked content, you can expand on this using CSS or JS masking techniques
      return html`<div class="masked">${content}</div>`;
    },
  },
  "uix-radio": {
    props: {
      selectedValue: { type: String, defaultValue: "" },
      options: { type: Array, defaultValue: [] },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ selectedValue, options, disabled }, { html }) => {
      return html`
        ${options.map(option => html`
          <label class="inline-flex items-center">
            <input type="radio" class="form-radio" name="radios" value="${option}" .checked="${selectedValue === option}" ?disabled="${disabled}">
            <span class="ml-2">${option}</span>
          </label>
        `)}
      `;
    },
  },

  "uix-tooltip": {
    props: {
      content: { type: String, defaultValue: "Tooltip Content" },
      position: { type: String, defaultValue: "top", enum: Directions },
      trigger: { type: String, defaultValue: "hover", enum: Triggers }
    },
    render: ({ content, position, trigger }, { html }) => {
      // Implementation will vary based on how you're using DaisyUI for tooltips.
      // Below is a conceptual example.
      return html`
        <span data-tooltip="${content}" data-tooltip-position="${position}" data-tooltip-trigger="${trigger}">
          ${content}
        </span>
      `;
    },
  },

  "uix-toast": {
    props: {
      message: { type: String, defaultValue: "Toast Message" },
      duration: { type: Number, defaultValue: 3000 },
      position: { type: String, defaultValue: "top-right", enum: Positions },
      variant: { type: String, defaultValue: "default", enum: Variants }
    },
    render: ({ message, duration, position, variant }, { html }) => {
      // Toasts typically are dynamic and might require JavaScript to be displayed/hidden.
      // Below is a basic structure.
      return html`
        <div class="toast toast-${position} toast-${variant}" style="animation-duration: ${duration}ms;">
          ${message}
        </div>
      `;
    },
  },

  "uix-alert": {
    props: {
      message: { type: String, defaultValue: "Alert Message" },
      variant: { type: String, defaultValue: "default", enum: Variants },
      closable: { type: Boolean, defaultValue: true }
    },
    render: ({ message, variant, closable }, { html }) => {
      return html`
        <div class="alert alert-${variant}">
          ${message}
          ${closable ? html`<button class="alert-close-btn">&times;</button>` : ""}
        </div>
      `;
    },
  },

  "uix-input": {
    props: {
      value: { type: String, defaultValue: "" },
      placeholder: { type: String, defaultValue: "Enter value" },
      disabled: { type: Boolean, defaultValue: false },
      type: { type: String, defaultValue: "text", enum: ["text", "password", "email", "number", "search"] },
      maxLength: { type: Number, defaultValue: null }
    },
    render: ({ value, placeholder, disabled, type, maxLength }, { html }) => {
      return html`
        <input class="input input-${type}" .value="${value}" placeholder="${placeholder}" ?disabled="${disabled}" type="${type}" .maxLength="${maxLength}">
      `;
    },
  },
  "uix-badge": {
    props: {
      content: { type: String, defaultValue: "Text" },
      variant: { 
        type: String,
        defaultValue: "default",
        enum: Variants        
      },
      pill: { type: Boolean, defaultValue: false }
    },
    render: ({ content, variant, pill }, { html }) => {
      const colorClass = `bg-${variant}-focus text-${variant}-content`;
      const pillClass = pill ? "rounded-full" : "rounded-md";
      return html`<span class="${colorClass} ${pillClass}">${content}</span>`;
    },
  },  
  
  "uix-textarea": {
    props: {
      value: { type: String, defaultValue: "" },
      placeholder: { type: String, defaultValue: "Enter text" },
      disabled: { type: Boolean, defaultValue: false },
      rows: { type: Number, defaultValue: 4 }
    },
    render: ({ value, placeholder, disabled, rows }, { html }) => {
      return html`<textarea placeholder="${placeholder}" ?disabled=${disabled} rows=${rows}>${value}</textarea>`;
    },
  },
  "uix-file-input": {
    props: {
      acceptedTypes: { type: String, defaultValue: "*/*" },
      multiple: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: "Choose File" }
    },
    render: ({ acceptedTypes, multiple, label }, { html }) => {
      return html`<input type="file" accept="${acceptedTypes}" ?multiple="${multiple}" class="bg-neutral p-2 rounded" aria-label="${label}" />`;
    },
  },

  "uix-range-slider": {
    props: {
      min: { type: Number, defaultValue: 0 },
      max: { type: Number, defaultValue: 100 },
      step: { type: Number, defaultValue: 1 },
      value: { type: Number, defaultValue: 50 }
    },
    render: ({ min, max, step, value }, { html }) => {
      return html`<input type="range" min="${min}" max="${max}" step="${step}" value="${value}" class="bg-neutral p-2 rounded" />`;
    },
  },

  "uix-select": {
    props: {
      options: { type: Array, defaultValue: [] },
      selectedValue: { type: String, defaultValue: "" },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ options, selectedValue, disabled }, { html }) => {
      return html`
        <select ?disabled="${disabled}" class="form-select">
          ${options.map(option => html`<option value="${option}" ?selected="${option === selectedValue}">${option}</option>`)}
        </select>
      `;
    },
  },

  "uix-input-group": {
    props: {
      label: { type: String, defaultValue: "Group Label" },
      direction: { type: String, defaultValue: "horizontal", enum: Directions }
    },
    render: ({ label, direction }, { html }) => {
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      return html`<div class="flex ${directionClass}"><label class="font-bold">${label}</label><slot></slot></div>`;
    },
  },

  "uix-rating": {
    props: {
      maxValue: { type: Number, defaultValue: 5 },
      value: { type: Number, defaultValue: 0 }
    },
    render: ({ maxValue, value }, { html }) => {
      return html`
        ${Array.from({ length: maxValue }).map((_, index) => 
    html`<span class="text-${index < value ? "primary" : "neutral"}">★</span>`
  )}
      `;
    },
  },

  "uix-artboard": {
    props: {
      content: { type: String, defaultValue: "Artboard Content" },
      width: { type: String, defaultValue: "auto" },
      height: { type: String, defaultValue: "auto" }
    },
    render: ({ content, width, height }, { html }) => {
      return html`<div style="width: ${width}; height: ${height};" class="border rounded p-2">${content}</div>`;
    },
  },

  "uix-stack": {
    props: {
      direction: { type: String, defaultValue: "vertical", enum: Directions },
      spacing: { type: String, defaultValue: "default" }
    },
    render: ({ direction, spacing }, { html }) => {
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      return html`<div class="flex ${directionClass} space-${spacing}"><slot></slot></div>`;
    },
  },

  "uix-join": {
    props: {
      direction: { type: String, defaultValue: "vertical", enum: Directions }
    },
    render: ({ direction }, { html }) => {
      const directionClass = direction === "horizontal" ? "join" : "join-vertical";
      return html`<div class="${directionClass}"><slot></slot></div>`;
    },
  },
  "uix-navbar": {
    props: {
      items: { type: Array, defaultValue: [] },
      position: { type: String, defaultValue: "top" },
      sticky: { type: Boolean, defaultValue: false }
    },
    render: ({ items, position, sticky }, { html }) => {
      return html`
        <nav class="navbar-${position} ${sticky ? "sticky" : ""}">
          ${items.map(item => html`<uix-button label=${item.label} variant=${item.variant}></uix-button>`)}
        </nav>
      `;
    },
  },

  "uix-button-group": {
    props: {
      direction: { type: String, defaultValue: "horizontal" }
    },
    render: ({ direction }, { html }) => {
      return html`
        <div class="button-group-${direction}">
          <slot></slot> <!-- Expecting uix-button elements here -->
        </div>
      `;
    },
  },

  "uix-dropdown": {
    props: {
      trigger: { type: String, defaultValue: "click" },
      items: { type: Array, defaultValue: [] }
    },
    render: ({ trigger, items }, { html }) => {
      return html`
        <div class="dropdown">
          <uix-button label="Open Dropdown"></uix-button>
          <div class="dropdown-content">
            ${items.map(item => html`<a href=${item.href}>${item.label}</a>`)}
          </div>
        </div>
      `;
    },
  },

  "uix-bottom-navigation": {
    props: {
      items: { type: Array, defaultValue: [] },
      selectedValue: { type: String, defaultValue: "" }
    },
    render: ({ items, selectedValue }, { html }) => {
      return html`
        <div class="bottom-navigation">
          ${items.map(item => html`
            <uix-button 
              label=${item.label} 
              variant=${item.value === selectedValue ? "primary" : "secondary"}
            ></uix-button>
          `)}
        </div>
      `;
    },
  },
  "uix-footer": {
    props: {
      content: { type: String, defaultValue: "Footer Content" }
    },
    render: ({ content }, { html }) => {
      return html`
        <footer class="bg-neutral p-4">${content}</footer>
      `;
    },
  },
  "uix-collapse": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      content: { type: String, defaultValue: "Collapse Content" }
    },
    render: ({ isOpen, content }, { html }) => {
      const displayClass = isOpen ? "block" : "hidden";
      return html`
        <div class="${displayClass}">
          ${content}
        </div>
      `;
    },
  },

  "uix-accordion": {
    props: {
      items: { type: Array, defaultValue: [] },
      multi: { type: Boolean, defaultValue: false }
    },
    render: ({ items, multi }, { html }) => {
      return html`
        <div class="accordion ${multi ? "accordion-multi" : ""}">
          ${items.map(item => html`
            <button class="accordion-btn">${item.title}</button>
            <div class="accordion-content">
              ${item.content}
            </div>
          `)}
        </div>
      `;
    },
  },

  "uix-tabs": {
    props: {
      items: { type: Array, defaultValue: [] },
      selectedValue: { type: String, defaultValue: "" }
    },
    render: ({ items, selectedValue }, { html }) => {
      return html`
        <div class="tabs">
          ${items.map(item => html`
            <button class="tab ${item.value === selectedValue ? "active" : ""}">${item.label}</button>
          `)}
          <!-- Corresponding tab contents can be rendered here -->
        </div>
      `;
    },
  },

  "uix-breadcrumbs": {
    props: {
      items: { type: Array, defaultValue: [] },
      separator: { type: String, defaultValue: "/" }
    },
    render: ({ items, separator }, { html }) => {
      return html`
        <nav class="breadcrumbs">
          ${items.map(item => html`<a href=${item.href}>${item.label}</a><span>${separator}</span>`)}
        </nav>
      `;
    },
  },

  "uix-pagination": {
    props: {
      currentPage: { type: Number, defaultValue: 1 },
      totalPages: { type: Number, defaultValue: 10 }
    },
    render: ({ currentPage, totalPages }, { html }) => {
      // Basic pagination logic, can be improved based on use case
      return html`
        <div class="pagination">
          ${Array.from({ length: totalPages }).map((_, idx) => html`<uix-button label=${idx + 1} variant=${idx + 1 === currentPage ? "primary" : "neutral"}></uix-button>`)}
        </div>
      `;
    },
  },

  "uix-browser-mockup": {
    props: {
      url: { type: String, defaultValue: "https://example.com" },
      content: { type: String, defaultValue: "Browser Content" }
    },
    render: ({ url, content }, { html }) => {
      return html`
        <div class="browser-mockup">
          <div class="url-bar">${url}</div>
          <div class="content">${content}</div>
        </div>
      `;
    },
  },

  "uix-code-mockup": {
    props: {
      code: { type: String, defaultValue: "Example code" },
      language: { type: String, defaultValue: "html" }
    },
    render: ({ code, language }, { html }) => {
      // Syntax highlighting and other features can be implemented based on the 'language' prop.
      return html`
        <pre class="code-mockup">${code}</pre>
      `;
    },
  },

  "uix-phone-mockup": {
    props: {
      content: { type: String, defaultValue: "Phone Content" }
    },
    render: ({ content }, { html }) => {
      return html`
        <div class="phone-mockup">${content}</div>
      `;
    },
  },

  "uix-window-mockup": {
    props: {
      title: { type: String, defaultValue: "Window Title" },
      content: { type: String, defaultValue: "Window Content" }
    },
    render: ({ title, content }, { html }) => {
      return html`
        <div class="window-mockup">
          <div class="title">${title}</div>
          <div class="content">${content}</div>
        </div>
      `;
    },
  },

  "uix-card": {
    props: {
      title: { type: String, defaultValue: "Card Title" },
      subtitle: { type: String, defaultValue: "Subtitle" },
      content: { type: String, defaultValue: "Card Content" },
      image: { type: String, defaultValue: "" },
      footerContent: { type: String, defaultValue: "" }
    },
    render: ({ title, subtitle, content, image, footerContent }, { html }) => {
      return html`
        <div class="card">
          ${image ? html`<img src=${image} alt="Card Image" />` : ""}
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <p>${content}</p>
          <footer>${footerContent}</footer>
        </div>
      `;
    },
  },

  "uix-carousel": {
    props: {
      items: { type: Array, defaultValue: [] },
      autoplay: { type: Boolean, defaultValue: true },
      duration: { type: Number, defaultValue: 3000 }
    },
    render: ({ items, autoplay, duration }, { html }) => {
      // A more complex carousel logic with autoplay, animations, etc. would be required here.
      return html`
        <div class="carousel">
          ${items.map(item => html`<div class="slide">${item.content}</div>`)}
        </div>
      `;
    },
  },

  "uix-chat-bubble": {
    props: {
      message: { type: String, defaultValue: "Chat Message" },
      sender: { type: String, defaultValue: "Sender Name" }
    },
    render: ({ message, sender }, { html }) => {
      return html`
        <div class="chat-bubble">
          <strong>${sender}</strong>
          <p>${message}</p>
        </div>
      `;
    },
  },

  "uix-menu": {
    props: {
      items: { type: Array, defaultValue: [] },
      horizontal: { type: Boolean, defaultValue: false }
    },
    render: ({ items, horizontal }, { html }) => {
      return html`
        <ul class="menu ${horizontal ? "horizontal" : "vertical"}">
          ${items.map(item => html`<li><a href=${item.href}>${item.label}</a></li>`)}
        </ul>
      `;
    },
  },

  "uix-progress": {
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, maxValue, variant }, { html }) => {
      return html`
        <progress class="progress progress-${variant} w-56" value="${value}" max="${maxValue}"></progress>
      `;
    },
  },

  "uix-radial-progress": {
    // Placeholder for radial progress. Adjust accordingly for real implementation.
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, maxValue, variant }, { html }) => {
      return html`
        <progress class="progress progress-${variant} w-56" value="${value}" max="${maxValue}"></progress>
      `;
    },
  },

  "uix-table": {
    props: {
      columns: { type: Array, defaultValue: [] },
      data: { type: Array, defaultValue: [] },
      striped: { type: Boolean, defaultValue: false },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ columns, data, striped, variant }, { html }) => {
      const tableClass = striped ? `table table-striped table-${variant}` : `table table-${variant}`;
      return html`
        <table class="${tableClass}">
          <thead>
            <tr>
              ${columns.map(column => html`<th>${column}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => html`
              <tr>
                ${row.map(cell => html`<td>${cell}</td>`)}
              </tr>
            `)}
          </tbody>
        </table>
      `;
    },
  },

  "uix-steps": {
    props: {
      steps: { type: Array, defaultValue: [] },
      currentStep: { type: Number, defaultValue: 1 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ steps, currentStep, variant }, { html }) => {
      return html`
        <div class="steps">
          ${steps.map((step, index) => {
    const stepClass = (index + 1) === currentStep ? `step step-${variant}` : "step";
    return html`<div class="${stepClass}">${step}</div>`;
  })}
        </div>
      `;
    },
  },

  "uix-swap": {
    props: {
      value: { type: String, defaultValue: "" },
      swapValue: { type: String, defaultValue: "" },
      labelA: { type: String, defaultValue: "A" },
      labelB: { type: String, defaultValue: "B" },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, swapValue, labelA, labelB, variant }, { html }) => {
      return html`
        <div class="p-4 space-x-2">
          <label>${labelA}: <input class="input input-bordered input-${variant}" type="text" value="${value}"></label>
          <label>${labelB}: <input class="input input-bordered input-${variant}" type="text" value="${swapValue}"></label>
        </div>
      `;
    },
  }, "uix-drawer": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      position: {
        type: String,
        defaultValue: "left",
        enum: Positions
      }
    },
    render: ({ isOpen, position }, { html }) => {
      const positionClass = `drawer-${position}`;
      return html`
        <div class=${positionClass} ?open=${isOpen}>
          <slot></slot>
        </div>
      `;
    },
  },

  "uix-modal": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      title: { type: String, defaultValue: "Modal Title" },
      content: { type: String, defaultValue: "Modal Content" },
      closable: { type: Boolean, defaultValue: true }
    },
    render: ({ isOpen, title, content, closable, setIsOpen }, { html }) => {
      return html`
        <div class="modal" ?open=${isOpen}>
          <div class="modal-title">${title}</div>
          <div class="modal-content">${content}</div>
          ${closable ? html`<uix-button @click=${() => setIsOpen(false)}>Close</uix-button>` : ""}
        </div>
      `;
    },
  },

  "uix-loading": {
    props: {
      isVisible: { type: Boolean, defaultValue: false },
      message: { type: String, defaultValue: "Loading..." }
    },
    render: ({ isVisible, message }, { html }) => {
      return isVisible ? html`<div class="loading">${message}</div>` : html``;
    },
  },

  "uix-countdown": {
    props: {
      endDate: { type: String, defaultValue: "YYYY-MM-DD HH:MM:SS" },
      format: {
        type: String,
        defaultValue: "DHMS",
        enum: Formats
      }
    },
    render: ({ endDate, format }, { html }) => {
      // You'd need to implement countdown logic using `endDate` and format it using `format`.
      return html`<div class="countdown">${endDate} - ${format}</div>`;
    },
  },

  "uix-indicator": {
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      format: {
        type: String,
        defaultValue: "percentage",
        enum: IndicatorsFormat}
    },
    render: ({ value, maxValue, format }, { html }) => {
      const percentageValue = (value / maxValue) * 100;
      const displayValue = format === "percentage" ? `${percentageValue}%` : `${value}/${maxValue}`;
      return html`
        <div class="indicator">
          <div class="indicator-bar" style="width: ${percentageValue}%;"></div>
          <span>${displayValue}</span>
        </div>
      `;
    },
  },

  "uix-stat": {
    props: {
      number: { type: String, defaultValue: "0" },
      description: { type: String, defaultValue: "Description" },
      color: {
        type: String,
        defaultValue: "default",
        enum: Variants        
      },
    },
    render: ({ number, description, color }, { html }) => {
      const numberClass = `text-${color}-content font-bold text-4xl`;
      const descClass = `text-${color}-content text-lg mt-2`;

      return html`
        <div class="p-4">
          <div class=${numberClass}>${number}</div>
          <div class=${descClass}>${description}</div>
        </div>
      `;
    },
  },
};
      