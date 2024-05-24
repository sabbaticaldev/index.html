import { html, staticHtml, T, unsafeStatic } from "helpers";

const cardProps = {
  border: T.boolean({ defaultValue: true }),
  shadow: T.boolean({ defaultValue: true }),
  variant: T.string({ defaultValue: "primary" }),
  text: T.string(),
  rounded: T.boolean({ defaultValue: "none" }),
  spacing: T.string({ defaultValue: "md" }),
};

const tableProps = {
  headers: T.array(),
  rows: T.array(),
  currentPage: T.number({ defaultValue: 1 }),
  resultsPerPage: T.number({ defaultValue: 10 }),
};

const paginatedRows = function () {
  const startIndex = (this.currentPage - 1) * this.resultsPerPage;
  return this.rows.slice(startIndex, startIndex + this.resultsPerPage);
};

const Card = {
  props: cardProps,
  render() {
    const baseClass = this.theme("uix-card");
    return html`<uix-block containerClass=${baseClass} spacing=${this.spacing}><slot></slot></uix-block>`;
  },
};

const Table = {
  props: tableProps,
  paginatedRows,
  render() {
    const headerElements = this.headers.map((header) => html`<th scope="col" class=${this.theme("uix-table__header")}>${header}</th>`);
    const rowElements = this.paginatedRows().map((row) =>
      html`<tr>${Array.isArray(row) ? row : Object.values(row).map((cell) => html`<td class=${this.theme("uix-table__cell")}>${cell}</td>`)}</tr>`
    );

    return html`
      <div>
        <table class=${this.theme("uix-table")}>
          <thead>
            <tr>${headerElements}</tr>
          </thead>
          <tbody>${rowElements}</tbody>
        </table>
        <uix-pagination
          totalResults=${this.rows.length}
          currentPage=${this.currentPage}
          resultsPerPage=${this.resultsPerPage}
          .onPageChange=${this.setCurrentPage}
        ></uix-pagination>
      </div>
    `;
  },
};

const MockupPhone = {
  props: {
    prefix: T.string(),
    code: T.string(),
    highlight: T.boolean(),
    variant: T.string(),
  },
  render() {
    return html`
      <div class=${this.theme("uix-mockup-phone")}>
        <div class=${this.theme("uix-mockup-phone__top")}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 0 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 1 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 2 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "right", index: 1 })}></div>
        <div class=${this.theme("uix-mockup-phone__content")}><slot></slot></div>
      </div>
    `;
  },
};

const TAG_MAP = {
  "4xl": "h1",
  "3xl": "h2",
  "2xl": "h2",
  xl: "h2",
  lg: "h3",
  md: "h4",
  sm: "h5",
  xs: "h6",
};

const Avatar = {
  props: {
    src: T.string(),
    alt: T.string({ defaultValue: "" }),
    size: T.string({ defaultValue: "sm" }),
    placeholder: T.string({ defaultValue: "" }),
  },
  render() {
    const { src, alt, placeholder } = this;
    let content;
    if (src) {
      content = html`<img src=${src} class=${this.theme("uix-avatar__img")} alt=${alt} />`;
    } else if (placeholder) {
      content = html`<span class=${this.theme("uix-avatar__img")}>${placeholder}</span>`;
    }

    return html`
      <div class=${this.theme("uix-avatar")}>${content}</div>
    `;
  },
};

const Badge = {
  props: {
    size: T.string({ defaultValue: "xs" }),
    variant: T.string({ defaultValue: "default" }),
    icon: T.string({ defaultValue: null }),
  },
  render() {
    return html`
      <span @click=${this.click} class=${this.theme("uix-badge")}>
        <slot></slot>
      </span>
    `;
  },
};

const Icon = {
  props: {
    name: T.string(),
    size: T.string({ defaultValue: "" }),
    containerClass: T.string(),
  },
  render() {
    const { name } = this;
    return html`<ion-icon name=${name} role="img"></ion-icon>`;
  },
};

const Loading = {
  props: {
    isVisible: T.boolean(),
    message: T.string({ defaultValue: null }),
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "primary" }),
  },
  render() {
    const { isVisible, message, type, size } = this;
    if (!isVisible) return html``;
    const Loading = {
      spinner: "loading loading-spinner",
      dots: "loading loading-dots",
      ring: "loading loading-ring",
      ball: "loading loading-ball",
      bars: "loading loading-bars",
      infinity: "loading loading-infinity",
    };
    const LoadingSize = {
      lg: "loading-lg",
      md: "loading-md",
      sm: "loading-sm",
      xs: "loading-xs",
    };

    const loadingClass = `${Loading[type]} ${LoadingSize[size]}`;

    return html`
      <span class="${loadingClass}">
        ${message ? html`<span>${message}</span>` : ""}
        ${message && type === "spinner" ? html`<uix-icon name="spinner"></uix-icon>` : ""}
      </span>
    `;
  },
};

const Text = {
  props: {
    size: T.string({}),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
    href: T.string(),
    onclick: T.function(),
    leading: T.string({}),
  },
  render() {
    const { size } = this;
    const isLink = Boolean(this.onclick || this.href);
    const tag = isLink ? "a" : TAG_MAP[size] || "p";
    
    return isLink ?
      html`<a href=${this.href || "#"} @click=${this.onclick}><slot></slot></a>`
      : 
      staticHtml`
      <${unsafeStatic(tag)} class="${unsafeStatic(`${this.theme("uix-text")}`)}">
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};

const theme = (userTheme, props) => ({
  "uix-card": { _base: "shadow", spacing: props.SpacingSizes, variant: props.BaseVariants },
  "uix-block": { spacing: props.SpacingSizes, variant: props.BaseVariants },
  "uix-list": {
    _base: "flex", spacing: props.SpacingSizes, gap: props.Gaps, justify: props.JustifyContent,
    full: ({ vertical }) => ({ true: vertical ? "w-full" : "h-full" }),
    vertical: { true: "flex-col" },
    responsive: ({ vertical }) => ({ true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row" }),
    reverse: ({ vertical }) => ({ true: vertical ? "flex-col-reverse" : "flex-row-reverse" })
  },
  "uix-divider": "flex items-center my-2",
  "uix-divider__border": "border-t border-gray-400 flex-grow",
  "uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
  "uix-mockup-phone": "relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[700px] w-[400px] shadow-xl",
  "uix-mockup-phone__top": "w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute",
  "uix-mockup-phone__side": ({ position = "left", index = 0 }) => ({
    _base: `h-[${index === 0 ? 32 : index === 1 ? 46 : 64}px] w-[3px] bg-gray-800 absolute -${position}-[17px] top-[${index === 0 ? 72 : index === 1 ? 124 : 142}px] rounded-${position === "left" ? "l" : "r"}-lg`
  }),
  "uix-mockup-phone__content": "rounded-xl overflow-hidden w-[372px] h-[672px] bg-white",
  "uix-table": "w-full text-sm text-left text-gray-500 dark:text-gray-400",
  "uix-table__header": "p-3 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
  "uix-table__cell": "px-3 py-2 text-xs",

  "uix-avatar": { ...props.commonStyles, size: props.DimensionSizes },
  "uix-avatar__img": { _base: "", size: props.DimensionSizes },
  "uix-badge": { ...props.commonStyles, size: [props.SpacingSizes, props.TextSizes] },
  "uix-text": { _base: "", variant: props.TextColors, weight: props.FontWeight, font: props.FontType, leading: props.LeadingSizes, size: [props.LeadingSizes, props.TrackingSizes, props.TextSizes] },
});

export default {
  theme,
  views: {
    "uix-card": Card,
    "uix-table": Table,
    "uix-mockup-phone": MockupPhone,
    "uix-avatar": Avatar,
    "uix-badge": Badge,
    "uix-icon": Icon,
    "uix-loading": Loading,
    "uix-text": Text,
  },
};
