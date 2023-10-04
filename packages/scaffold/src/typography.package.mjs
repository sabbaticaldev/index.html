import {
  Variants,
} from "./style-props.mjs"; 

const HeadingColors = {
  "primary": "text-primary",
  "secondary": "text-secondary",
  "accent": "text-accent",
  "neutral": "text-neutral",
  "base": "text-base",
  "info": "text-info",
  "success": "text-success",
  "warning": "text-warning",
  "error": "text-error"
};

const LinkColors = {
  "primary": "text-primary hover:text-primary-dark",
  "secondary": "text-secondary hover:text-secondary-dark",
  "accent": "text-accent hover:text-accent-dark",
  "neutral": "text-neutral hover:text-neutral-dark",
  "base": "text-base hover:text-base-dark",
  "info": "text-info hover:text-info-dark",
  "success": "text-success hover:text-success-dark",
  "warning": "text-warning hover:text-warning-dark",
  "error": "text-error hover:text-error-dark"
};

const createContent = (variant, classes) => {
  const variantClass = HeadingColors[variant] || "prose";
  return { class: `${variantClass} ${classes || ""}`};
};
export default {  
  views: {
    
    "uix-heading": {
      props: {
        size: { type: Number, defaultValue: 1, enum: [1, 2, 3, 4, 5, 6] },
        variant: { type: String, defaultValue: "primary", enum: Variants },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ size, variant, classes }, { html }) => {
        const { class: combinedClass } = createContent(variant, classes);
        const HeadingTemplates = {
          1: (cls) => html`<h1 class="${cls} text-4xl font-bold mt-0 mb-4"><slot></slot></h1>`,
          2: (cls) => html`<h2 class="${cls} text-3xl font-bold mt-4 mb-3"><slot></slot></h2>`,
          3: (cls) => html`<h3 class="${cls} text-2xl font-semibold mt-4 mb-3"><slot></slot></h3>`,
          4: (cls) => html`<h4 class="${cls} text-xl font-semibold mt-3 mb-2"><slot></slot></h4>`,
          5: (cls) => html`<h5 class="${cls} text-lg font-medium mt-3 mb-2"><slot></slot></h5>`,
          6: (cls) => html`<h6 class="${cls} text-base font-medium mt-2 mb-1"><slot></slot></h6>`
        };
        const getHeading = (size, cls) => {
          const templateFunction = HeadingTemplates[size] || HeadingTemplates[1];
          return templateFunction(cls);
        };

        return getHeading(size, combinedClass);
      }
    },
    
    "uix-paragraph": {
      props: {
        variant: { type: String, defaultValue: "base", enum: Variants },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ variant, classes }, {html}) => {
        const { class: combinedClass } = createContent(variant, classes);
        return html`<p class="${combinedClass}"><slot></slot></p>`;
      }
    },
    
    "uix-emphasis": {
      props: {
        weight: { type: String, defaultValue: "strong", enum: ["strong", "emphasis"] },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ weight, classes }, { html }) => {
        const { class: combinedClass } = createContent(weight, classes);
        if (weight === "strong") {
          return html`<strong class="${combinedClass}"><slot></slot></strong>`;
        } else {
          return html`<em class="${combinedClass}"><slot></slot></em>`;
        }
      }
    },
    "uix-link": {
      props: {
        href: { type: String, defaultValue: "#" },
        content: { type: String, defaultValue: "Link" },
        external: { type: Boolean, defaultValue: false },
        variant: { 
          type: String, 
          defaultValue: "primary",
          enum: Variants 
        },
        underlineOnHover: { type: Boolean, defaultValue: false },
        icon: { type: String, defaultValue: null },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ href, content, external, variant, underlineOnHover, icon, classes }, { html }) => {
        const variantClass = LinkColors[variant];
        const hoverUnderlineClass = underlineOnHover ? "hover:underline" : "";
        const externalAttrs = external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : "";
    
        return html`
          <a href="${href}" 
             class="${variantClass} ${hoverUnderlineClass} ${classes}" 
             ${externalAttrs}
          >
            ${icon ? html`<uix-icon name="${icon}"></uix-icon>` : ""}
            ${content || "<slot></slot>"}
          </a>
        `;
      }
    }
  },
};
