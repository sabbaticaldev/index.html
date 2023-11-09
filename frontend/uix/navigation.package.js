import { T } from "../helpers/types.js";
import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";

export default {
  views: {
    "uix-modal": {
      props: {
        actions: T.function(),
        size: T.string({ defaultValue: "md" }),
        parent: T.object(),
      },
      firstUpdated: function () {
        this.$modal = this.shadowRoot.querySelector("#modal");
        this.closeModal = (msg = "") => this.$modal.close(msg);
        if (this.parent) this.parent.closeModal = this.closeModal;
      },
      render: function () {
        const { actions } = this;
        const openclick = function () {
          this.$modal.showModal();
        };

        return html`
          <slot name="button" @click=${openclick}></slot>
          <dialog id="modal" class=${this.generateTheme("uix-modal")}>
            <div class="modal-box">
              <uix-button
                @click=${this.closeModal}
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
  },
};
