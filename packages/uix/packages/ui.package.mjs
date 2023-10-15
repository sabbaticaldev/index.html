import { T } from "bootstrapp-shared";
import { html } from "lit";

import {
  AnimationTypes,
  Sizes,
  Formats,
  Colors,
  BgColor,
  TextColor,
  BorderColor,
  RingColor,
} from "../uix.theme.mjs";

export default {
  views: {
    "uix-avatar": {
      props: {
        src: T.string(),
        alt: T.string({ defaultValue: "" }),
        size: T.number({ defaultValue: 24 }),
        shape: T.string({
          defaultValue: "rounded",
          enum: [
            "rounded",
            "rounded-full",
            "mask-squircle",
            "mask-hexagon",
            "mask-triangle",
          ],
        }),
        status: T.string({ enum: ["online", "offline", ""] }),
        placeholder: T.string({ defaultValue: "" }),
        hasRing: T.boolean(),
        ringColor: T.string({ defaultValue: "primary", enum: Colors }),
      },
      render: ({
        src,
        alt,
        size,
        shape,
        status,
        placeholder,
        hasRing,
        ringColor,
      }) => {
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
      },
    },
    "uix-avatar-group": {
      props: {
        avatars: T.array(),
        count: T.number({ defaultValue: 0 }),
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
              `,
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
      },
    },
    "uix-badge": {
      props: {
        content: T.string(),
        color: T.string({ defaultValue: "default", enum: Colors }),
        outline: T.boolean(),
        size: T.string({ defaultValue: "md", enum: ["lg", "md", "sm", "xs"] }),
        icon: T.string({ defaultValue: null }),
      },
      render: ({ color, outline, size }) => {
        const baseClass = "badge";
        const colorClass = BgColor[color] + (outline ? "-outline" : "");
        const sizeClassMapping = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs",
        };
        const sizeClass = sizeClassMapping[size];

        return html`
          <span class="${baseClass} ${colorClass} ${sizeClass}">
            <slot></slot>
          </span>
        `;
      },
    },
    "uix-icon": {
      props: {
        name: T.string(),
        classes: T.object(),
      },
      render: ({ name, classes }) => {
        const { container: containerClass = "text-2xl" } = classes || {};
        return html`<ion-icon
          name=${name}
          class=${containerClass}
          role="img"
        ></ion-icon>`;
      },
    },
    "uix-kbd": {
      props: {
        keyContent: T.string({ defaultValue: "Key" }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
      },
      render: ({ keyContent, size }) => {
        const sizeClassMap = {
          lg: "text-lg px-3 py-2",
          md: "text-md px-2 py-1", // default
          sm: "text-sm px-1 py-0.5",
          xs: "text-xs px-0.5 py-0.25",
        };
        const sizeClasses = sizeClassMap[size];
        const kbdClass = `bg-primary-200 rounded ${sizeClasses}`;
        return html`<kbd class=${kbdClass}>${keyContent}</kbd>`;
      },
    },
    "uix-countdown": {
      props: {
        endDate: T.string({ defaultValue: "YYYY-MM-DD HH:MM:SS" }),
        format: T.string({ defaultValue: "DHMS", enum: Formats }),
      },
      render: ({ endDate, format }) => {
        const calculateCountdown = (end) => {
          const now = new Date();
          const endDateTime = new Date(end);
          const diff = endDateTime - now;

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
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
      },
    },
    "uix-mask": {
      props: {
        variant: T.string({ defaultValue: "squircle" }),
        src: T.string(),
      },
      render: ({ variant, src }) => {
        return html`<img class="mask ${variant}" src=${src} />`;
      },
    },
    "uix-loading": {
      props: {
        isVisible: T.boolean(),
        message: T.string({ defaultValue: null }),
        type: T.string({ defaultValue: "spinner", enum: AnimationTypes }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
      },
      render: ({ isVisible, message, type, size, color }) => {
        if (!isVisible) return html``;
        const Loading = {
          spinner: "loading loading-spinner",
          dots: "loading loading-dots",
          ring: "loading loading-ring",
          ball: "loading loading-ball",
          bars: "loading loading-bars",
          infinity: "loading loading-infinity",
        };
        const LoadingSize = {
          lg: "loading-lg",
          md: "loading-md",
          sm: "loading-sm",
          xs: "loading-xs",
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
      },
    },
    "uix-progress": {
      // TODO: expand daisyui tags
      props: {
        value: T.number({ defaultValue: 0 }),
        max: T.number({ defaultValue: 100 }),
        width: T.string({ defaultValue: "w-56" }),
        color: T.string({ defaultValue: "base", enum: Colors }),
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
      },
    },

    "uix-radial-progress": {
      // TODO: expand daisyui tags
      props: {
        value: T.number({ defaultValue: 0 }),
        size: T.string({ defaultValue: "4rem" }),
        thickness: T.string({ defaultValue: "0.4rem" }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        backgroundColor: T.string({ defaultValue: "default" }),
        borderColor: T.string({ defaultValue: "default" }),
        borderWidth: T.string({ defaultValue: "0px" }),
        textColor: T.string({ defaultValue: "default-content" }),
      },
      render: ({
        value,
        size,
        thickness,
        color,
        backgroundColor,
        borderColor,
        borderWidth,
        textColor,
      }) => {
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
      },
    },
  },
};
