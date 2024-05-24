import { html, T } from "helpers";

const Modal = {
  props: {
    actions: T.function(),
    size: T.string({ defaultValue: "md" }),
    parent: T.object(),
    open: T.boolean(),
  },
  firstUpdated() {
    this.$modal = this.shadowRoot.querySelector("#modal");
    if (this.parent) this.parent.hide = this.hide.bind(this);
  },
  hide(msg = "") {
    this.$modal.close(msg);
  },
  show() {
    this.$modal.showModal();
  },
  render() {
    return html`
      <slot name="button" @click=${this.show.bind(this)}></slot>
      <dialog id="modal" ?open=${this.open} class=${this.theme("uix-modal")}>
        <div class=${this.theme("uix-modal__box")}>
          <uix-button @click=${this.hide.bind(this)} variant="" shape="circle" size="sm" class=${this.theme("uix-modal__close-button")}>✕</uix-button>
          <uix-list vertical>
            <slot></slot>
            <uix-list>
              <slot name="footer"></slot>
              ${this.actions?.({ host: this }) || ""}
            </uix-list>
          </uix-list>
        </div>
      </dialog>
    `;
  },
};

const Tooltip = {
  render() {
    return html`
      <div class=${this.theme("uix-tooltip")}>
        <button class=${this.theme("uix-tooltip__button")}>
          <slot name="button"></slot>
        </button>
        <span class=${this.theme("uix-tooltip__content")}>
          <slot></slot>
        </span>
      </div>
    `;
  },
};

const Tabs = {
  props: {
    size: T.string({ defaultValue: "md" }),
    gap: T.string({ defaultValue: "" }),
    spacing: T.string({ defaultValue: "md" }),
    vertical: T.boolean(),
    full: T.boolean(),
    selectTab: T.string(),
  },
  unselectTab() {
    const slot = this.shadowRoot.querySelector("slot");
    const tabs = slot.assignedNodes().filter(node => node.tagName && node.tagName.toLowerCase() === "uix-tab");
    tabs.forEach(tab => tab.setActive(false));
  },


  render() {
    return html`
      <uix-list ?vertical=${this.vertical} spacing=${this.spacing} ?full=${this.full} gap=${this.gap}>
        <slot></slot>
      </uix-list>
    `;
  },
};

const Tab = {
  props: {
    active: T.boolean(),
    parent: T.object(),
    onclick: T.function(),
    onclose: T.function(),
  },
  selectTab(e) {
    this.parentElement.unselectTab();
    this.setActive(true);
    this.onclick?.(e);
  },
  firstUpdated() {
    if (this.onclose) {
      this.shadowRoot.addEventListener("auxclick", event => {
        event.stopPropagation();
        if (event.button === 1) this.onclose();
      });
    }
  },
  render() {
    return html`
      <button role="tab" ?active=${this.active} @click=${this.selectTab.bind(this)} class=${this.theme("uix-tab")}>
        <slot></slot>
        ${this.onclose && html`
          <button @click=${event => {
    event.stopPropagation();
    this.onclose();
  }} class=${this.theme("uix-tab__close-button")}>
            &times;
          </button>
        `}
      </button>
    `;
  },
};

const Pagination = {
  props: {
    totalResults: T.number(),
    currentPage: T.number(),
    resultsPerPage: T.number({ defaultValue: 10 }),
    onPageChange: T.function(),
  },
  renderPageLink(page, label) {
    const isActive = page === this.currentPage;
    const linkClass = this.theme(isActive ? "uix-pagination__link-active" : "uix-pagination__link");
    return html`
      <li class=${this.theme("uix-pagination__item")}>
        <a href="#" class=${linkClass} @click=${() => this.onPageChange(page)}>
          ${label || page}
        </a>
      </li>
    `;
  },
  render() {
    const totalPageCount = Math.floor(this.totalResults / this.resultsPerPage);
    const startItem = (this.currentPage - 1) * this.resultsPerPage + 1;
    const endItem = Math.min(startItem + this.resultsPerPage - 1, this.totalResults);
    const visiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPageCount, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pageLinks = [];
    if (this.currentPage > 1) {
      pageLinks.push(this.renderPageLink(this.currentPage - 1, "Previous"));
    }
    if (startPage > 1) {
      pageLinks.push(this.renderPageLink(1));
      if (startPage > 2) {
        pageLinks.push(this.renderPageLink(startPage - 1, "..."));
      }
    }
    for (let page = startPage; page <= endPage; page++) {
      pageLinks.push(this.renderPageLink(page));
    }
    if (endPage < totalPageCount) {
      if (endPage < totalPageCount - 1) {
        pageLinks.push(this.renderPageLink(endPage + 1, "..."));
      }
      pageLinks.push(this.renderPageLink(totalPageCount));
    }
    if (this.currentPage < totalPageCount) {
      pageLinks.push(this.renderPageLink(this.currentPage + 1, "Next"));
    }

    return html`
      <nav class=${this.theme("uix-pagination__nav")} aria-label="Table navigation">
        <span class=${this.theme("uix-pagination__info")}>
          Showing <span class=${this.theme("uix-pagination__info-highlight")}>${startItem}-${endItem}</span> of <span class=${this.theme("uix-pagination-info-highlight")}>${this.totalResults}</span>
        </span>
        <ul class=${this.theme("uix-pagination__list")}>${pageLinks}</ul>
      </nav>
    `;
  },
};

const ContextMenu = {
  props: { open: T.boolean(), contextmenu: T.function() },
  closeContextMenuHandler() {
    this.setOpen(false);
  },
  documentClickHandler(event) {
    if (!this.contains(event.target) && this !== event.target) {
      this.setOpen(false);
    }
  },
  escapeKeyHandler(event) {
    if (event.key === "Escape") {
      this.setOpen(false);
    }
  },
  connectedCallback() {
    document.addEventListener("close-context-menu", this.closeContextMenuHandler.bind(this));
    document.addEventListener("click", this.documentClickHandler.bind(this));
    document.addEventListener("keydown", this.escapeKeyHandler.bind(this));
  },
  disconnectedCallback() {
    document.removeEventListener("close-context-menu", this.closeContextMenuHandler);
    document.removeEventListener("click", this.documentClickHandler);
    document.removeEventListener("keydown", this.escapeKeyHandler);
  },
  render() {
    return html`
      <div class=${this.theme("uix-context-menu")} ?hidden=${!this.open}>
        <slot name="menu"></slot>
      </div>
      <slot @contextmenu=${(e) => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent("close-context-menu"));
    setTimeout(() => {
      this.setOpen(true);
    }, 0);
  }}></slot>
    `;
  },
};

const theme = (userTheme, props) => ({
  "uix-modal": { _base: props.cls(["rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]", props.borderRadius]), size: props.SpacingSizes },
  "uix-tooltip": { _base: props.cls(["group relative m-12", props.borderRadius]), spacing: props.SpacingSizes },
  "uix-tooltip__button": { _base: props.cls(["bg-gray-500 px-4 py-2 text-sm shadow-sm text-white", props.borderRadius]), variant: props.BaseVariants, spacing: props.SpacingSizes },
  "uix-tooltip__content": "absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-white text-xs group-hover:scale-100",  
  "uix-tab": {
    _base: props.cls(["relative group", userTheme.flexCenter, "p-2 -mb-px sm:px-4 -px-1 w-full h-full whitespace-nowrap focus:outline-none", userTheme.borderStyles, userTheme.borderWidth]),
    active: {
      true: props.cls([userTheme.activeTextColor, "border-blue-500"]),
      false: props.cls([userTheme.defaultTextColor, userTheme.hoverBorder])
    },
    variant: props.BaseVariants,
    size: props.SpacingSizes
  },
  "uix-tab__summary": "cursor-pointer",
  "uix-tab__close-button": "absolute top-1 right-2 text-sm font-bold leading-none group-hover:inline hidden",
  "uix-pagination__nav": "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4",
  "uix-pagination__info": "text-sm font-normal text-gray-500 dark:text-gray-400",
  "uix-pagination__info-highlight": "font-semibold text-gray-900 dark:text-white",
  "uix-pagination__list": "inline-flex items-stretch -space-x-px",
  "uix-pagination__item": "p-2",
  "uix-pagination__link": "flex items-center justify-center p-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
  "uix-pagination__link-active": "flex items-center justify-center p-2 text-sm leading-tight text-blue-600 bg-blue-50 border border-blue-300",
  "uix-context-menu": "z-10 absolute top-6 left-10 bg-white border border-gray-300 shadow-lg",
});
export default {
  theme,
  views: {
    "uix-modal": Modal,
    "uix-tooltip": Tooltip,
    "uix-tabs": Tabs,
    "uix-tab": Tab,
    "uix-pagination": Pagination,
    "uix-context-menu": ContextMenu,
  },
};
