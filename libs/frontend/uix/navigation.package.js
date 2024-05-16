import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

export default {
  views: {
    "uix-modal": {
      props: {
        actions: T.function(),
        size: T.string({ defaultValue: "md" }),
        parent: T.object(),
        open: T.boolean(),
      },
      firstUpdated: function () {
        this.$modal = this.shadowRoot.querySelector("#modal");
        if (this.parent) this.parent.hide = this.hide;
      },
      hide: function (msg = "") {
        this.$modal.close(msg);
      },
      show: function () {
        this.$modal.showModal();
      },
      render: function () {
        const { actions, open } = this;
        return html`
          <slot name="button" @click=${this.show}></slot>
          <dialog
            id="modal"
            ?open=${open}
            class=${this.generateTheme("uix-modal")}
          >
            <div class="modal-box">
              <uix-button
                @click=${this.hide}
                variant=""
                shape="circle"
                size="sm"
                class="absolute right-1 top-0"
              >
                ✕
              </uix-button>

              <uix-list vertical>
                <slot></slot>
                <!--// TODO: remove this and inline the buttons wherever it is used-->
                <uix-list>
                  <slot name="footer"></slot>
                  ${actions?.({ host: this }) || ""}
                </uix-list>
              </uix-list>
            </div>
          </dialog>
        `;
      },
    },
    "uix-tooltip": {
      render: function () {
        return html`
          <div class=${this.generateTheme("uix-tooltip")}>
            <button class=${this.generateTheme("uix-tooltip__button")}>
              <slot name="button"></slot>
            </button>
            <span class=${this.generateTheme("uix-tooltip__content")}>
              <slot></slot>
            </span>
          </div>
        `;
      },
    },
    "uix-tabs": {
      props: {
        items: T.array(),
        size: T.string({ defaultValue: "md" }),
        gap: T.string({ defaultValue: "md" }),
        spacing: T.string({ defaultValue: "md" }),
        full: T.boolean(),
        selectTab: T.string()
      },
      unselectTab() {
        const slot = this.shadowRoot.querySelector("slot");
        const tabs = slot
          .assignedNodes()
          .filter(
            (node) => node.tagName && node.tagName.toLowerCase() === "uix-tab",
          );

        tabs.forEach((tab) => {
          tab.setActive(false);
        });
      },
      render: function () {
        return html`
          <div class=${this.generateTheme("uix-tabs")}>
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-tab": {
      props: {
        icon: T.string(),
        label: T.string(),
        active: T.boolean(),
        parent: T.object(),
        onclick: T.function(),
        onclose: T.function(),
      },
      selectTab: function (e) {
        this.parentElement.unselectTab();
        this.setActive(true);
        this.onclick?.(e);
      },
      firstUpdated: function () {
        const { onclose } = this;
        if (onclose) {
          this.shadowRoot.addEventListener("auxclick", function (event) {
            event.stopPropagation();
            if (event.button === 1) {
              onclose();
            }
          });
        }
      },
      render: function () {
        const { active, selectTab, onclose } = this;
        return html`
          <button
            role="tab"
            ?active=${active}
            @click=${selectTab}
            class=${this.generateTheme("uix-tab")}
          >
            <slot></slot>
            ${onclose &&
            html`<button
              @click=${(event) => {
    event.stopPropagation();
    onclose();
  }}
              class="absolute top-1 right-2 text-sm font-bold leading-none group-hover:inline hidden"
            >
              &times;
            </button>`}
          </button>
        `;
      },
    },
    "uix-pagination": {
      props: {
        totalResults: T.number(),
        currentPage: T.number(),
        resultsPerPage: T.number({ defaultValue: 10 }),
        onPageChange: T.function(),
      },
      render: function () {
        const totalPageCount = Math.floor(
          this.totalResults / this.resultsPerPage,
        );
        const startItem = (this.currentPage - 1) * this.resultsPerPage + 1;
        const endItem = Math.min(
          startItem + this.resultsPerPage - 1,
          this.totalResults,
        );

        // Generate page links with "Previous", "Next", and ellipsis for large page counts
        const pageLinks = [];
        const visiblePages = 5; // Number of pages to display in the pagination control

        let startPage = Math.max(
          1,
          this.currentPage - Math.floor(visiblePages / 2),
        );
        let endPage = Math.min(totalPageCount, startPage + visiblePages - 1);

        // If there are not enough pages to display after the current page, adjust the start page again.
        if (endPage - startPage + 1 < visiblePages && startPage > 1) {
          startPage = Math.max(1, endPage - visiblePages + 1);
        }

        // "Previous" link
        if (this.currentPage > 1) {
          pageLinks.push(this.renderPageLink(this.currentPage - 1, "Previous"));
        }

        // First page and ellipsis if needed
        if (startPage > 1) {
          pageLinks.push(this.renderPageLink(1));
          if (startPage > 2) {
            pageLinks.push(this.renderPageLink(startPage - 1, "..."));
          }
        }

        // Page number links
        for (let page = startPage; page <= endPage; page++) {
          pageLinks.push(this.renderPageLink(page));
        }

        // Last page and ellipsis if needed
        if (endPage < totalPageCount) {
          if (endPage < totalPageCount - 1) {
            pageLinks.push(this.renderPageLink(endPage + 1, "..."));
          }
          pageLinks.push(this.renderPageLink(totalPageCount));
        }

        // "Next" link
        if (this.currentPage < totalPageCount) {
          pageLinks.push(this.renderPageLink(this.currentPage + 1, "Next"));
        }

        return html`
          <nav
            class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing
              <span class="font-semibold text-gray-900 dark:text-white"
                >${startItem}-${endItem}</span
              >
              of
              <span class="font-semibold text-gray-900 dark:text-white"
                >${this.totalResults}</span
              >
            </span>
            <ul class="inline-flex items-stretch -space-x-px">
              ${pageLinks}
            </ul>
          </nav>
        `;
      },
      renderPageLink(page, label) {
        label = label || page;
        const isActive = page === this.currentPage;
        const linkClass = isActive
          ? "text-blue-600 bg-blue-50 border border-blue-300"
          : "text-gray-500 bg-white border border-gray-300";

        return html`
          <li class="p-2">
            <a
              href="#"
              class="flex items-center justify-center p-2 text-sm leading-tight ${linkClass} hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              @click=${() => this.onPageChange(page)}
              >${label}</a
            >
          </li>
        `;
      },
    },

    "uix-context-menu": {
      props: { open: T.boolean(), contextmenu: T.function() },
      closeContextMenuHandler: function () {
        this.setOpen(false);
      },

      documentClickHandler: function (event) {
        if (!this.contains(event.target) && this !== event.target) {
          this.setOpen(false);
        }
      },

      escapeKeyHandler: function (event) {
        if (event.key === "Escape") {
          this.setOpen(false);
        }
      },

      connectedCallback: function () {
        document.addEventListener(
          "close-context-menu",
          this.closeContextMenuHandler.bind(this),
        );
        document.addEventListener(
          "click",
          this.documentClickHandler.bind(this),
        );
        document.addEventListener("keydown", this.escapeKeyHandler.bind(this));
      },

      disconnectedCallback: function () {
        document.removeEventListener(
          "close-context-menu",
          this.closeContextMenuHandler,
        );
        document.removeEventListener("click", this.documentClickHandler);
        document.removeEventListener("keydown", this.escapeKeyHandler);
      },
      render: function () {
        const { open, setOpen } = this;
        return html` <div
            class="z-10 absolute top-6 left-10 ${open
    ? ""
    : "hidden"} bg-white border border-gray-300 shadow-lg"
          >
            <slot name="menu"></slot>
          </div>
          <slot
            @contextmenu=${(e) => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent("close-context-menu"));
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }}
          ></slot>`;
      },
    },
  },
};
