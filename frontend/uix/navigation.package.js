import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";

import { T } from "../helpers/types.js";

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
      render: function () {
        return html`<nav
          class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white"
              >1-10</span
            >
            of
            <span class="font-semibold text-gray-900 dark:text-white"
              >1000</span
            >
          </span>
          <ul class="inline-flex items-stretch -space-x-px">
            <li>
              <a
                href="#"
                class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >1</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >2</a
              >
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                class="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >3</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >...</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >100</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>`;
      },
    },
  },
};
