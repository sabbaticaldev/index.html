# VideoPlayer

The VideoPlayer component is used to embed and play video content in your application.

## Props

| Name      | Type      | Default   | Description                                                 |
|-----------|-----------|-----------|-------------------------------------------------------------|
| src       | `string`  | -         | The URL or path to the video file.                          |
| poster    | `string`  | -         | The URL or path to the poster image displayed before video playback. |
| autoplay  | `boolean` | `false`   | Determines if the video should start playing automatically. |
| controls  | `boolean` | `true`    | Determines if the video controls should be displayed.       |
| loop      | `boolean` | `false`   | Determines if the video should loop continuously.           |
| muted     | `boolean` | `false`   | Determines if the video should be muted by default.         |

## Examples

```html
<uix-video-player 
  src="/path/to/video.mp4"
  poster="/path/to/poster.jpg"
  autoplay
  loop
  muted
></uix-video-player>
```

## Source Code

The source code for the VideoPlayer component can be found at [libs/frontend/uix/content/video-player.js](../uix/content/video-player.js).