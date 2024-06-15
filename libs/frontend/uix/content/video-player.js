import { html, T, genTheme } from "helpers";

const VideoPlayer = {
  tag: "uix-video-player",
  props: {
    src: T.string(),
    poster: T.string(),
    autoplay: T.boolean({ defaultValue: false }),
    controls: T.boolean({ defaultValue: true }),
    loop: T.boolean({ defaultValue: false }),
    muted: T.boolean({ defaultValue: false }),
  },
  _theme: {
    "": "w-full h-auto rounded-lg shadow-lg overflow-hidden",
    ".uix-video-player__controls": "bg-gray-800 text-white p-2 rounded-b-lg",
  },
  render() {
    const { src, poster, autoplay, controls, loop, muted } = this;

    return html`
      <div class="uix-video-player">
        <video
          class="w-full"
          src=${src}
          ?autoplay=${autoplay}
          ?controls=${controls}
          ?loop=${loop}
          ?muted=${muted}
          poster=${poster}
        >
          <p>
            Your browser doesn't support HTML5 video. Here is a
            <a href=${src}>link to the video</a> instead.
          </p>
        </video>
        ${controls
          ? html`
              <div class="uix-video-player__controls">
                <slot></slot>
              </div>
            `
          : ""}
      </div>
    `;
  },
};

export default VideoPlayer;
