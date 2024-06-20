# Logo

The Logo component displays the application logo with optional icon and name.

## Props

| Prop      | Type   | Default | Description                                 |
|-----------|--------|---------|---------------------------------------------|
| icon      | string |         | Name of the icon to display                 |
| name      | string |         | Name to display next to the icon            |
| iconImage | string |         | URL of the image to use for the icon        |
| nameImage | string |         | URL of the image to use for the name        |
| image     | string |         | URL of the image to use for the entire logo |

## Examples

```html
<!-- Display icon and name -->
<uix-logo icon="star" name="My App"></uix-logo>

<!-- Display only an image -->
<uix-logo image="/path/to/logo.png"></uix-logo>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-logo",
  props: {
    icon: T.string(),
    name: T.string(),
    iconImage: T.string(),
    nameImage: T.string(),
    image: T.string(),
  },
  render() {
    const { icon, name, iconImage, nameImage, image } = this;

    return html`
      ${image
        ? html`<img src=${image} alt=${name} />`
        : html`
            ${iconImage
              ? html`<img src=${iconImage} alt="" />`
              : icon
              ? html`<uix-icon name=${icon}></uix-icon>`
              : ""}
            ${nameImage
              ? html`<img src=${nameImage} alt=${name} />`
              : name
              ? html`<span>${name}</span>`
              : ""}
          `}
    `;
  },
};
```