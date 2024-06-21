# UIX Video Player Documentation

## Introduction
The `uix-video-player` component is a customizable HTML5 video player that supports various features like autoplay, controls, looping, and more. It provides a default style that can be easily customized using the theme system.

## API Table

### Properties

| Property   | Type      | Default | Description                                       |
|------------|-----------|---------|---------------------------------------------------|
| `src`      | `string`  | `""`    | The source URL of the video.                      |
| `poster`   | `string`  | `""`    | The URL of an image to show before the video plays.|
| `autoplay` | `boolean` | `false` | If `true`, the video will start playing automatically.|
| `controls` | `boolean` | `true`  | If `true`, the video player controls will be displayed.|
| `loop`     | `boolean` | `false` | If `true`, the video will loop continuously.      |
| `muted`    | `boolean` | `false` | If `true`, the video will be muted.               |

## Examples

### Basic Video Player
```html
<uix-video-player src="video.mp4"></uix-video-player>
```
```code
<uix-video-player src="video.mp4"></uix-video-player>
```

### Video Player with Poster Image
```html
<uix-video-player src="video.mp4" poster="poster.jpg"></uix-video-player>
```
```code
<uix-video-player src="video.mp4" poster="poster.jpg"></uix-video-player>
```

### Autoplay Video Player
```html
<uix-video-player src="video.mp4" autoplay></uix-video-player>
```
```code
<uix-video-player src="video.mp4" autoplay></uix-video-player>
```

### Looping Video Player
```html
<uix-video-player src="video.mp4" loop></uix-video-player>
```
```code
<uix-video-player src="video.mp4" loop></uix-video-player>
```

### Muted Video Player
```html
<uix-video-player src="video.mp4" muted></uix-video-player>
```
```code
<uix-video-player src="video.mp4" muted></uix-video-player>
```

### Video Player with Custom Controls
```html
<uix-video-player src="video.mp4" controls>
  <uix-button variant="primary" onclick="pauseVideo()">Pause</uix-button>
  <uix-button variant="secondary" onclick="playVideo()">Play</uix-button>
</uix-video-player>
```
```code
<uix-video-player src="video.mp4" controls>
  <uix-button variant="primary" onclick="pauseVideo()">Pause</uix-button>
  <uix-button variant="secondary" onclick="playVideo()">Play</uix-button>
</uix-video-player>

<script>
  function pauseVideo() {
    document.querySelector('uix-video-player video').pause();
  }
  function playVideo() {
    document.querySelector('uix-video-player video').play();
  }
</script>
```

## Notes
- The `uix-video-player` component provides a responsive video player that can be easily styled.
- Custom controls can be added using the `<slot>` element inside the `.uix-video-player__controls` section.
- The `autoplay` attribute should be used cautiously as it may lead to poor user experience.

By utilizing the `uix-video-player` component, you can easily integrate a customizable video player into your application with various features and styling options.