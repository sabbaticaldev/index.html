# AvatarGroup

The AvatarGroup component is used to display a group of avatars in a compact and visually appealing way. It allows you to show multiple user avatars together, with the ability to limit the number of displayed avatars and provide an overflow count for the remaining avatars.

## Props

| Name    | Type     | Default | Description                                                                                  |
|---------|----------|---------|----------------------------------------------------------------------------------------------|
| avatars | Array    | []      | An array of objects representing the avatars to display. Each object should have `src` and `alt` properties. |
| size    | String   | "sm"    | The size of the avatars. Possible values: "sm", "md", "lg".                                  |
| max     | Number   | 3       | The maximum number of avatars to display before showing the overflow count.                  |

## Examples

```html
<uix-avatar-group 
  :avatars="[
    { src: 'avatar1.jpg', alt: 'Avatar 1' },
    { src: 'avatar2.jpg', alt: 'Avatar 2' },
    { src: 'avatar3.jpg', alt: 'Avatar 3' },
    { src: 'avatar4.jpg', alt: 'Avatar 4' }
  ]"
  size="md"
  :max="3"
></uix-avatar-group>
```

In this example, the AvatarGroup component will display the first three avatars from the `avatars` array, with a size of "md". If there are more than three avatars, an overflow count will be shown for the remaining avatars.

## Source Code

You can find the source code for the AvatarGroup component [here](../uix/content/avatar-group.js).
++ libs/frontend/uix/content/avatar-group.js