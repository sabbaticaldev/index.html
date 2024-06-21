# App Shell

The App Shell component provides the main structure and layout for the application.

## Props

| Prop           | Type   | Default | Description                                 |
|----------------|--------|---------|---------------------------------------------|
| containerClass | string |         | CSS class to apply to the container element |

## Examples

```html
<uix-app-shell>
  <uix-logo slot="logo"></uix-logo>
  <uix-navbar slot="navbar" .items=${navbarItems}></uix-navbar>
  <main>
    <!-- Page content goes here -->
  </main>
  <uix-footer slot="footer"></uix-footer>
</uix-app-shell>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-app-shell",
  props: { containerClass: T.string() },
  theme: {
    "uix-app-shell": "w-full h-full flex flex-col",
    "uix-app-shell__content": "flex h-full",
    "uix-app-shell__main": "relative content flex-grow overflow-y-auto",
  },
  render() {
    const { navbarItems, navbarPosition } = this;

    const navbarSlot =
      navbarPosition === "left" ? "left-navbar" : "right-navbar";
    return html`
      <uix-topbar>
        <uix-logo slot="logo"></uix-logo>
        <uix-navbar slot="navbar" .items=${navbarItems}></uix-navbar>
      </uix-topbar>
      <slot name="top-navbar"></slot>
      <div class="uix-app-shell__content">
        <slot name="left-navbar"></slot>
        <main class="uix-app-shell__main">
          <slot></slot>
        </main>
        <slot name="right-navbar"></slot>
      </div>
      <slot name="footer"></slot>
    `;
  },
};
```