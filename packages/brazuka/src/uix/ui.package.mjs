import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import {
  html as staticHtml,
  unsafeStatic
} from "https://esm.sh/lit/static-html.js";

import {
  AnimationTypes,
  Sizes,
  Colors,
  BadgeColor,
  TextColor,
  RingColor,
  TextSizes,
  LeadingSizes,
  HeadingColors,
  FontWeight,
  FontType
} from "../uix.theme.mjs";

const TAG_MAP = {
  "4xl": "h1",
  "3xl": "h2",
  "2xl": "h2",
  xl: "h2",
  lg: "h3",
  md: "h4",
  sm: "h5",
  xs: "h6"
};

export default {
  views: {
    "uix-avatar": {
      props: {
        src: T.string(),
        alt: T.string({ defaultValue: "" }),
        size: T.string({ defaultValue: "sm", enums: Sizes }),
        shape: T.string({
          defaultValue: "rounded-full",
          enum: [
            "rounded",
            "rounded-full",
            "mask-squircle",
            "mask-hexagon",
            "mask-triangle"
          ]
        }),
        status: T.string({ enum: ["online", "offline", ""] }),
        placeholder: T.string({ defaultValue: "" }),
        hasRing: T.boolean(),
        ringColor: T.string({ defaultValue: "primary", enum: Colors })
      },
      render: ({
        src,
        alt,
        size,
        shape,
        status,
        placeholder,
        hasRing,
        ringColor
      }) => {
        const WidthSizes = {
          xs: "w-8",
          sm: "w-12",
          md: "w-16",
          lg: "w-24",
          xl: "w-32",
          "2xl": "w-64"
        };
        const sizeClass = WidthSizes[size];
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
        avatars: T.array(),
        count: T.number({ defaultValue: 0 })
      },
      render: ({ avatars, count }) => {
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
        color: T.string({ defaultValue: "primary", enum: Colors }),
        outline: T.boolean(),
        rounded: T.boolean(),
        size: T.string({ defaultValue: "md", enum: ["lg", "md", "sm", "xs"] }),
        icon: T.string({ defaultValue: null })
      },
      render: ({ color, outline, size, rounded }) => {
        const sizeClassMapping = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs"
        };

        const baseClass = [
          "badge",
          rounded ? "" : "rounded-none",
          BadgeColor[color] + (outline ? "-outline" : ""),
          sizeClassMapping[size] || ""
        ]
          .filter(Boolean)
          .join(" ");

        return html`
          <span class=${baseClass}>
            <slot></slot>
          </span>
        `;
      }
    },
    "uix-icon": {
      props: {
        name: T.string(),
        size: T.string({ defaultValue: "", enum: Sizes }),
        containerClass: T.string()
      },
      render: ({ name, containerClass, size }) => {
        const baseClass = [containerClass, size && TextSizes[size]]
          .filter(Boolean)
          .join(" ");
        return html`<ion-icon
          name=${name}
          class=${baseClass}
          role="img"
        ></ion-icon>`;
      }
    },
    "uix-loading": {
      props: {
        isVisible: T.boolean(),
        message: T.string({ defaultValue: null }),
        type: T.string({ defaultValue: "spinner", enum: AnimationTypes }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        color: T.string({ defaultValue: "primary", enum: Colors })
      },
      render: ({ isVisible, message, type, size, color }) => {
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
        value: T.number({ defaultValue: 0 }),
        max: T.number({ defaultValue: 100 }),
        width: T.string({ defaultValue: "w-56" }),
        color: T.string({ defaultValue: "base", enum: Colors })
      },
      render: ({ value, max, width, color }) => {
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

    "uix-text": {
      props: {
        size: T.string({ enum: Sizes }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        weight: T.string({ defaultValue: "", enum: FontWeight }),
        font: T.string({ defaultValue: "sans", enum: FontType }),
        leading: T.string({ enum: Sizes }),
        containerClass: T.string()
      },
      render: (props) => {
        const { size, font, color, weight, containerClass, leading } = props;
        const baseClass = [
          "prose",
          HeadingColors[color],
          FontWeight[weight],
          containerClass,
          FontType[font],
          LeadingSizes[leading]
        ]
          .filter(Boolean)
          .join(" ");

        const tag = TAG_MAP[size] || "p";
        const trackingClass =
          size === "4xl" || size === "3xl" || size === "2xl"
            ? "tracking-wider"
            : size === "xl" || size === "lg"
              ? "tracking-wide"
              : "";
        return staticHtml`
              <${unsafeStatic(tag)} class="${unsafeStatic(
  `${trackingClass} ${baseClass}`
)}">
                <slot></slot>
              </${unsafeStatic(tag)}>
            `;
      }
    }
  }
};
