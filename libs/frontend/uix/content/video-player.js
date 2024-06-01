import { html, T } from "helpers";

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
  theme: {
    "uix-video-player": "w-full",
  },
  render() {
    const { src, poster, autoplay, controls, loop, muted } = this;

    return html`
      <video
        data-theme="uix-video-player"
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
    `;
  },
};

export default VideoPlayer;
