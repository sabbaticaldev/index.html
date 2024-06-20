# UIX Tooltip Documentation

## Introduction
The `uix-tooltip` component is used to display a tooltip with customizable content and styles. It supports various positions and color variants.

## API Table

### Properties

| Property   | Type     | Default   | Description                                      |
|------------|----------|-----------|--------------------------------------------------|
| `spacing`  | `string` | `"md"`    | The spacing of the tooltip.                      |
| `variant`  | `string` | `"default"` | The visual style variant of the tooltip.         |
| `position` | `string` | `"top"`   | The position of the tooltip (top, right, bottom, left). |

## Examples

### Default Tooltip
```html
<uix-tooltip>
  <button slot="cta">Hover me</button>
  Tooltip content
</uix-tooltip>
```
```html
<uix-tooltip>
  <button slot="cta">Hover me</button>
  Tooltip content
</uix-tooltip>
```

### Tooltip with Different Variants
```html
<uix-tooltip variant="primary">
  <button slot="cta">Hover me</button>
  Primary Tooltip
</uix-tooltip>

<uix-tooltip variant="success">
  <button slot="cta">Hover me</button>
  Success Tooltip
</uix-tooltip>
```
```html
<uix-tooltip variant="primary">
  <button slot="cta">Hover me</button>
  Primary Tooltip
</uix-tooltip>

<uix-tooltip variant="success">
  <button slot="cta">Hover me</button>
  Success Tooltip
</uix-tooltip>
```

### Tooltip with Different Positions
```html
<uix-tooltip position="top">
  <button slot="cta">Hover me</button>
  Tooltip on top
</uix-tooltip>

<uix-tooltip position="right">
  <button slot="cta">Hover me</button>
  Tooltip on right
</uix-tooltip>

<uix-tooltip position="bottom">
  <button slot="cta">Hover me</button>
  Tooltip on bottom
</uix-tooltip>

<uix-tooltip position="left">
  <button slot="cta">Hover me</button>
  Tooltip on left
</uix-tooltip>
```
```html
<uix-tooltip position="top">
  <button slot="cta">Hover me</button>
  Tooltip on top
</uix-tooltip>

<uix-tooltip position="right">
  <button slot="cta">Hover me</button>
  Tooltip on right
</uix-tooltip>

<uix-tooltip position="bottom">
  <button slot="cta">Hover me</button>
  Tooltip on bottom
</uix-tooltip>

<uix-tooltip position="left">
  <button slot="cta">Hover me</button>
  Tooltip on left
</uix-tooltip>
```