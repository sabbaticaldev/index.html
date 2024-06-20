# UIX Accordion Documentation

## Introduction
The `uix-accordion` and `uix-accordion-item` components are used to create collapsible sections in your user interface. These components are ideal for organizing content in a space-efficient manner, allowing users to expand and collapse sections as needed.

## API Table

### Properties

#### `uix-accordion`

| Property    | Type      | Default | Description                             |
|-------------|-----------|---------|-----------------------------------------|
| `multiple`  | `boolean` | `false` | Allow multiple accordion items to be open simultaneously. |
| `border`    | `boolean` | `false` | Add a border to the accordion container. |

#### `uix-accordion-item`

| Property | Type      | Default | Description                                  |
|----------|-----------|---------|----------------------------------------------|
| `label`  | `string`  | `""`    | The label text for the accordion item.       |
| `icon`   | `string`  | `""`    | The icon name to display next to the label.  |
| `open`   | `boolean` | `false` | Determine whether the accordion item is open by default. |

## Theme

### Accordion

| Class          | Description                            |
|----------------|----------------------------------------|
| `divide-y`     | Adds a dividing line between accordion items. |
| `divide-gray-800` | Sets the color of the dividing line. |
| `block`        | Displays the accordion as a block-level element. |
| `text-left`    | Aligns text to the left.               |

### Accordion Item

| Class                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `list-none`                 | Removes default list styles.                    |
| `cursor-pointer`            | Changes the cursor to a pointer on hover.       |
| `block`                     | Displays the summary as a block-level element.  |
| `uix-accordion__summary`    | Styles the summary element.                     |

## Examples

### Basic Accordion
```html
<uix-accordion>
  <uix-accordion-item label="Section 1" icon="icon1">
    <p>Content for section 1</p>
  </uix-accordion-item>
  <uix-accordion-item label="Section 2" icon="icon2">
    <p>Content for section 2</p>
  </uix-accordion-item>
</uix-accordion>
```
```code
<uix-accordion>
  <uix-accordion-item label="Section 1" icon="icon1">
    <p>Content for section 1</p>
  </uix-accordion-item>
  <uix-accordion-item label="Section 2" icon="icon2">
    <p>Content for section 2</p>
  </uix-accordion-item>
</uix-accordion>
```

### Accordion with Multiple Sections Open
```html
<uix-accordion multiple>
  <uix-accordion-item label="Section 1" icon="icon1" open>
    <p>Content for section 1</p>
  </uix-accordion-item>
  <uix-accordion-item label="Section 2" icon="icon2" open>
    <p>Content for section 2</p>
  </uix-accordion-item>
</uix-accordion>
```
```code
<uix-accordion multiple>
  <uix-accordion-item label="Section 1" icon="icon1" open>
    <p>Content for section 1</p>
  </uix-accordion-item>
  <uix-accordion-item label="Section 2" icon="icon2" open>
    <p>Content for section 2</p>
  </uix-accordion-item>
</uix-accordion>
```