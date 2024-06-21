# UIX Tabs Documentation

## Introduction
The `uix-tabs` component is used to create a tabbed interface. It supports the use of `uix-link` components as tabs, allowing for flexibility in tab content and styling.

## API Table

### Properties

| Property     | Type      | Default     | Description                                         |
|--------------|-----------|-------------|-----------------------------------------------------|
| `size`       | `string`  | `"md"`      | The size of the tabs.                               |
| `gap`        | `string`  | `""`        | The gap between tabs.                               |
| `spacing`    | `string`  | `"md"`      | The spacing of the container.                       |
| `vertical`   | `boolean` | `false`     | Whether the tabs are vertical.                      |
| `full`       | `boolean` | `true`      | Whether the tabs take full width.                   |
| `activeTab`  | `string`  | `""`        | The label of the active tab.                        |
| `variant`    | `string`  | `"default"` | The visual style variant of the tabs.               |

## Examples

### Basic Tabs
```html
<uix-tabs>
  <uix-link label="Tab 1" tab="tab-1">Tab 1</uix-link>
  <uix-link label="Tab 2" tab="tab-2">Tab 2</uix-link>
  <uix-link label="Tab 3" tab="tab-3">Tab 3</uix-link>
  <uix-container slot="content" id="tab-1">Content for tab 1</uix-container>
  <uix-container slot="content" id="tab-2">Content for tab 2</uix-container>
  <uix-container slot="content" id="tab-3">Content for tab 3</uix-container>  
</uix-tabs>
```

### Tabs with Icons
```html
<uix-tabs>
  <uix-link label="Tab 1" icon="star">Content for Tab 1</uix-link>
  <uix-link label="Tab 2" icon="heart">Content for Tab 2</uix-link>
  <uix-link label="Tab 3" icon="user">Content for Tab 3</uix-link>
</uix-tabs>
```

### Vertical Tabs
```html
<uix-tabs vertical>
  <uix-link label="Tab 1">Content for Tab 1</uix-link>
  <uix-link label="Tab 2">Content for Tab 2</uix-link>
  <uix-link label="Tab 3">Content for Tab 3</uix-link>
</uix-tabs>
```

### Tabs with Different Variants
```html
<uix-tabs variant="primary">
  <uix-link label="Tab 1">Content for Tab 1</uix-link>
  <uix-link label="Tab 2">Content for Tab 2</uix-link>
  <uix-link label="Tab 3">Content for Tab 3</uix-link>
</uix-tabs>

<uix-tabs variant="secondary">
  <uix-link label="Tab 1">Content for Tab 1</uix-link>
  <uix-link label="Tab 2">Content for Tab 2</uix-link>
  <uix-link label="Tab 3">Content for Tab 3</uix-link>
</uix-tabs>
```