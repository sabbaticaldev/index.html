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
    gap: T.string({ defaultValue: "md" }),
    spacing: T.string({ defaultValue: "md" }),
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
      <div class=${this.theme("uix-tabs")}>
        <slot></slot>
      </div>
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

export default {
  views: {
    "uix-modal": Modal,
    "uix-tooltip": Tooltip,
    "uix-tabs": Tabs,
    "uix-tab": Tab,
    "uix-pagination": Pagination,
    "uix-context-menu": ContextMenu,
  },
};
