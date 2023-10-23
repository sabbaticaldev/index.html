import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import { TabsSize, Gaps, ModalPositions, Sizes } from "../uix.theme.mjs";

export default {
  views: {
    "uix-modal": {
      props: {
        actions: T.function(),
        parent: T.object(),
        title: T.string(),
        content: T.string(),
        openButton: T.function(),
        name: T.string({ defaultValue: "uix-modal" }),
        position: T.string({
          defaultValue: "middle",
          enum: ["top", "middle", "bottom"]
        }),
        icon: T.string()
      },
      firstUpdated: function () {
        this.$modal = this.shadowRoot.querySelector("#modal");
      },
      render: (host) => {
        const { parent, actions, title, position, openButton, icon } = host;
        const closeModal = (msg = "") => host.$modal.close(msg);
        if (parent) {
          parent.closeModal = closeModal;
        }
        const modalClass = `modal ${
          ModalPositions[position] || ModalPositions.middle
        }`;
        const openclick = () => {
          host.$modal.showModal();
        };

        return html`
          ${openButton
    ? openButton(openclick)
    : html`<button @click=${openclick}>open</button>`}

          <dialog id="modal" class=${modalClass}>
            <div class="modal-box">
              <uix-list vertical>
                <uix-list class="modal-title">
                  ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
                  <uix-text size="lg">${title || ""}</uix-text>
                </uix-list>
                <form method="dialog" id="form">
                  <slot></slot>

                  <uix-button
                    .click=${() => closeModal()}
                    variant="ghost"
                    shape="circle"
                    size="sm"
                    class="absolute right-2 top-2"
                  >
                    ✕
                  </uix-button>

                  <uix-list>
                    <slot name="footer"></slot>
                    ${actions?.({ host }) || ""}
                  </uix-list>
                </form>
              </uix-list>
            </div>
          </dialog>
        `;
      }
    },
    "uix-tabs": {
      props: {
        items: T.array(),
        selectedValue: T.string(),
        type: T.string({
          defaultValue: "default",
          enum: ["default", "boxed", "bordered", "lifted"]
        }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        gap: T.string({ defaultValue: "md", enum: Sizes })
      },
      render: ({ items, selectedValue, setSelectedValue, type, size, gap }) => {
        let selected = selectedValue;

        const getTabClass = (item) => {
          return [
            "tab",
            item.label === selected && "tab-active",
            item.disabled && "tab-disabled",
            type === "bordered" && "tab-bordered",
            type === "lifted" && "tab-lifted",
            Sizes.includes(size) && TabsSize[size]
          ]
            .filter(Boolean)
            .join(" ");
        };
        const gapClass = Gaps[gap] || "";

        return html`
          <div
            class=${`tabs ${type === "boxed" ? "tabs-boxed" : ""} ${gapClass}`}
          >
            ${items.map(
    (item) => html`
                <button
                  @click=${() => setSelectedValue(item.label)}
                  class=${getTabClass(item)}
                  role="tab"
                >
                  ${item.icon
    ? html`<uix-icon name=${item.icon}></uix-icon>`
    : ""}
                  ${item.label}
                </button>
              `
  )}
          </div>
        `;
      }
    }
  }
};
