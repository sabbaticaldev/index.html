# UIX Dropdown Documentation

## Introduction
The `uix-dropdown` component is used to create a dropdown menu that can be toggled by a link or button. It supports submenus and various visual styles.

## API Table

### `uix-dropdown`

#### Properties

| Property  | Type      | Default   | Description                     |
|-----------|-----------|-----------|---------------------------------|
| `open`    | `boolean` | `false`   | Whether the dropdown is open.   |
| `variant` | `string`  | `default` | The visual style of the dropdown.|

## Theme

### Dropdown

| Class                    | Description                                  |
|--------------------------|----------------------------------------------|
| `relative`               | Positions the dropdown relative to its container. |
| `inline-block`           | Displays the dropdown as an inline block.    |
| `uix-dropdown__button`   | Styles for the button that toggles the dropdown. |
| `uix-dropdown__panel`    | Styles for the dropdown panel.               |

## Examples

### Basic Dropdown
```html
<uix-dropdown>
  <uix-link slot="cta" icon="menu">Menu</uix-link>
  <uix-link href="/profile" icon="user">Profile</uix-link>
  <uix-link href="/settings" icon="settings">Settings</uix-link>
  <uix-link href="/logout" icon="log-out">Logout</uix-link>
</uix-dropdown>
```
```code
<uix-dropdown>
  <uix-link slot="cta" icon="menu">Menu</uix-link>
  <uix-link href="/profile" icon="user">Profile</uix-link>
  <uix-link href="/settings" icon="settings">Settings</uix-link>
  <uix-link href="/logout" icon="log-out">Logout</uix-link>
</uix-dropdown>
```

### Dropdown with Submenu
```html
<uix-dropdown>
  <uix-link slot="cta" icon="menu">Menu</uix-link>
  <uix-link href="/profile" icon="user">Profile</uix-link>
  <uix-link href="/settings" icon="settings">Settings</uix-link>
  <uix-dropdown>
    <uix-link slot="cta" icon="log-out">
      Logout
    </uix-link>    
    <uix-link href="/submenu1" icon="chevron-right">Submenu 1</uix-link>
    <uix-link href="/submenu2" icon="chevron-right">Submenu 2</uix-link>
  </uix-dropdown>
</uix-dropdown>
```

## Notes
- The `uix-dropdown` component is used to wrap around multiple `uix-link` and `uix-text` components.
- Each `uix-link` can contain a submenu using the `slot="content"` attribute.
- The dropdown can be styled using different variants.
- Icons can be added to `uix-link` and `uix-text` components using the `icon` attribute.
```