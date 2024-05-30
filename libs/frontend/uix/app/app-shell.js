import { html, T } from "helpers";

export default {
  tag: "uix-app-shell",
  props: { containerClass: T.string() },
  theme: {
    "uix-app-shell": "w-full h-full flex flex-col",
    "uix-app-shell__content": "flex h-full",
    "uix-app-shell__main": "relative content flex-grow overflow-y-auto",
  },
  render() {
    const { containerClass = "" } = this;
    return html`
      <div
        class=${this.theme("uix-app-shell") +
        (containerClass ? ` ${containerClass}` : "")}
      >
        <slot name="top-navbar"></slot>
        <div class=${this.theme("uix-app-shell__content")}>
          <slot name="left-navbar"></slot>
          <main class=${this.theme("uix-app-shell__main")}>
            <slot></slot>
          </main>
          <slot name="right-navbar"></slot>
        </div>
        <slot name="bottom-navbar"></slot>
      </div>
    `;
  },
};
