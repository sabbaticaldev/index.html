import {
  AnimationTypes,
  Sizes,
  Formats,
  Colors,
  BgColor,
  TextColor,
  BorderColor,
  RingColor
} from "../style-props.mjs";

export default {
  views: {
    "uix-avatar": {
      props: {
        src: { type: String },
        alt: { type: String, defaultValue: "" },
        size: { type: Number, defaultValue: 24 },
        shape: {
          type: String,
          defaultValue: "rounded",
          enum: [
            "rounded",
            "rounded-full",
            "mask-squircle",
            "mask-hexagon",
            "mask-triangle"
          ]
        },
        status: { type: String, enum: ["online", "offline", ""] },
        placeholder: { type: String, defaultValue: "" },
        hasRing: { type: Boolean, defaultValue: false },
        ringColor: { type: String, defaultValue: "primary", enum: Colors }
      },
      render: (
        { src, alt, size, shape, status, placeholder, hasRing, ringColor },
        { html }
      ) => {
        const sizeClass = `w-${size}`;
        const ringClass = hasRing
          ? `${RingColor[ringColor]} ring-offset-base-100 ring-offset-2`
          : "";
        let content;

        if (src) {
          content = html`<img src=${src} alt=${alt} />`;
        } else if (placeholder) {
          content = html`<span
            class="${size > 12 ? `text-${Math.round(size / 8)}xl` : "text-xs"}"
            >${placeholder}</span
          >`;
        }

        return html`
          <div class="avatar ${status} ${ringClass}">
            <div class="${sizeClass} ${shape}">${content}</div>
          </div>
        `;
      }
    },
    "uix-avatar-group": {
      props: {
        avatars: { type: Array, defaultValue: [] },
        count: { type: Number, defaultValue: 0 }
      },
      render: ({ avatars, count }, { html }) => {
        return html`
          <div class="avatar-group -space-x-6">
            ${avatars.map(
    (avatar) => html`
                <uix-avatar
                  src=${avatar.src}
                  alt=${avatar.alt}
                  size=${avatar.size}
                  shape=${avatar.shape}
                  status=${avatar.status}
                  placeholder=${avatar.placeholder}
                  hasRing=${avatar.hasRing}
                  ringColor=${avatar.ringColor}
                ></uix-avatar>
              `
  )}
            ${count > 0
    ? html`
                  <div class="avatar placeholder">
                    <div class="w-12 bg-neutral-focus text-neutral-content">
                      <span>+${count}</span>
                    </div>
                  </div>
                `
    : ""}
          </div>
        `;
      }
    },
    "uix-badge": {
      props: {
        content: { type: String, defaultValue: "" },
        color: {
          type: String,
          defaultValue: "default",
          enum: Colors
        },
        outline: { type: Boolean, defaultValue: false },
        size: {
          type: String,
          defaultValue: "md",
          enum: ["lg", "md", "sm", "xs"]
        },
        icon: { type: String, defaultValue: null }
      },
      render: ({ color, outline, size }, { html }) => {
        const baseClass = "badge";
        const colorClass = BgColor[color] + (outline ? "-outline" : "");
        const sizeClassMapping = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs"
        };
        const sizeClass = sizeClassMapping[size];

        return html`
          <span class="${baseClass} ${colorClass} ${sizeClass}">
            <slot></slot>
          </span>
        `;
      }
    },
    "uix-icon": {
      props: {
        name: "",
        classes: {}
      },
      render: (
        { name, classes: { container: containerClass = "text-2xl" } },
        { html }
      ) => {
        return html`<ion-icon
          name=${name}
          class=${containerClass}
          role="img"
        ></ion-icon>`;
      }
    },
    "uix-kbd": {
      props: {
        keyContent: { type: String, defaultValue: "Key" },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: ({ keyContent, size }, { html }) => {
        const sizeClassMap = {
          lg: "text-lg px-3 py-2",
          md: "text-md px-2 py-1", // default
          sm: "text-sm px-1 py-0.5",
          xs: "text-xs px-0.5 py-0.25"
        };
        const sizeClasses = sizeClassMap[size];
        const kbdClass = `bg-primary-200 rounded ${sizeClasses}`;
        return html`<kbd class=${kbdClass}>${keyContent}</kbd>`;
      }
    },
    "uix-countdown": {
      props: {
        endDate: { type: String, defaultValue: "YYYY-MM-DD HH:MM:SS" },
        format: {
          type: String,
          defaultValue: "DHMS",
          enum: Formats
        }
      },
      render: ({ endDate, format }, { html }) => {
        const calculateCountdown = (end) => {
          const now = new Date();
          const endDateTime = new Date(end);
          const diff = endDateTime - now;

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          return { days, hours, minutes, seconds };
        };

        const countdown = calculateCountdown(endDate);

        const formattedCountdown = format.split("").map((f) => {
          switch (f) {
          case "D":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.days};"></span>days</span
              >`;
          case "H":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.hours};"></span>hours</span
              >`;
          case "M":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.minutes};"></span
                >minutes</span
              >`;
          case "S":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.seconds};"></span
                >seconds</span
              >`;
          default:
            return "";
          }
        });

        return html` <div class="countdown">${formattedCountdown}</div> `;
      }
    },
    "uix-mask": {
      props: {
        variant: { type: String, defaultValue: "squircle" },
        src: String
      },
      render: ({ variant, src }, { html }) => {
        return html`<img class="mask ${variant}" src=${src} />`;
      }
    },
    "uix-loading": {
      props: {
        isVisible: { type: Boolean, defaultValue: false },
        message: { type: String, defaultValue: null },
        type: {
          type: String,
          defaultValue: "spinner",
          enum: AnimationTypes
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        color: {
          type: String,
          defaultValue: "primary",
          enum: Colors
        }
      },
      render: ({ isVisible, message, type, size, color }, { html }) => {
        if (!isVisible) return html``;
        const Loading = {
          spinner: "loading loading-spinner",
          dots: "loading loading-dots",
          ring: "loading loading-ring",
          ball: "loading loading-ball",
          bars: "loading loading-bars",
          infinity: "loading loading-infinity"
        };
        const LoadingSize = {
          lg: "loading-lg",
          md: "loading-md",
          sm: "loading-sm",
          xs: "loading-xs"
        };

        const loadingClass = `${Loading[type]} ${LoadingSize[size]} ${TextColor[color]}`;

        return html`
          <span class="${loadingClass}">
            ${message ? html`<span>${message}</span>` : ""}
            ${message && type === "spinner"
    ? html`<uix-icon name="spinner"></uix-icon>`
    : ""}
          </span>
        `;
      }
    },
    "uix-progress": {
      // TODO: expand daisyui tags
      props: {
        value: { type: Number, defaultValue: 0 },
        max: { type: Number, defaultValue: 100 },
        width: { type: String, defaultValue: "w-56" },
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        }
      },
      render: ({ value, max, width, color }, { html }) => {
        const progressClass = `progress ${width}`;
        const colorClass = color !== "base" ? `progress-${color}` : "";
        return html`
          <progress
            class="${progressClass} ${colorClass}"
            value="${value}"
            max="${max}"
          ></progress>
        `;
      }
    },

    "uix-radial-progress": {
      // TODO: expand daisyui tags
      props: {
        value: {
          type: Number,
          defaultValue: 0
        },
        size: {
          type: String,
          defaultValue: "4rem"
        },
        thickness: {
          type: String,
          defaultValue: "0.4rem"
        },
        color: {
          type: String,
          defaultValue: "primary",
          enum: Colors
        },
        backgroundColor: {
          type: String,
          defaultValue: "default"
        },
        borderColor: {
          type: String,
          defaultValue: "default"
        },
        borderWidth: {
          type: String,
          defaultValue: "0px"
        },
        textColor: {
          type: String,
          defaultValue: "default-content"
        }
      },
      render: (
        {
          value,
          size,
          thickness,
          color,
          backgroundColor,
          borderColor,
          borderWidth,
          textColor
        },
        { html }
      ) => {
        const textStyle = `text-${textColor}`;
        const bgColor =
          backgroundColor !== "default" ? BgColor[backgroundColor] : "";
        const borderColorStyle =
          borderColor !== "default"
            ? `border-${borderWidth} ${BorderColor[borderColor]}`
            : "";
        const textSizeStyle = `text-${color}`;
        return html`
          <div
            class="radial-progress ${textSizeStyle} ${bgColor} ${borderColorStyle} ${textStyle}"
            style="--value:${value}; --size:${size}; --thickness:${thickness};"
          >
            ${value}%
          </div>
        `;
      }
    }
  }
};
