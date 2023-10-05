import {
  Variants,
  Sizes,
  HeadingColors,
  LinkColors
} from "./style-props.mjs"; 


export default {  
  views: {
    
    "uix-heading": {
      props: {
        size: { type: String, defaultValue: "xl", enum: Sizes },
        variant: { type: String, defaultValue: "primary", enum: Variants },        
      },
      render: ({ size, variant }, { html }) => {
        const variantClass = HeadingColors[variant] + " prose";
        const HeadingTemplates = {
          "4xl": html`<h1 class="${variantClass} text-4xl font-bold mt-0 mb-4"><slot></slot></h1>`,
          "3xl":  html`<h2 class="${variantClass} text-3xl font-bold mt-4 mb-3"><slot></slot></h2>`,
          "2xl":  html`<h3 class="${variantClass} text-2xl font-semibold mt-4 mb-3"><slot></slot></h3>`,
          "xl":  html`<h4 class="${variantClass} text-xl font-semibold mt-3 mb-2"><slot></slot></h4>`,
          "lg":  html`<h5 class="${variantClass} text-lg font-medium mt-3 mb-2"><slot></slot></h5>`,
          "md":  html`<h6 class="${variantClass} text-base font-medium mt-2 mb-1"><slot></slot></h6>`,
          "sm":  html`<p class="${variantClass} text-base font-small text-sm"><slot></slot></p>`,
          "":  html`<p class="${variantClass} text-base font-small text-sm"><slot></slot></p>`
        };
        
        return HeadingTemplates[size] || HeadingTemplates["xl"];
      }
    },
    
    "uix-paragraph": {
      props: {
        variant: { type: String, defaultValue: "base", enum: Variants },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ variant }, {html}) => {

        const variantClass = HeadingColors[variant] + " prose";
        return html`<p class="${variantClass}"><slot></slot></p>`;
      }
    },
    
    "uix-emphasis": {
      props: {
        weight: { type: String, defaultValue: "strong", enum: ["strong", "emphasis"] },
        classes: { type: String, defaultValue: "" }
      },
      render: ({ weight,  }, { html }) => {
        if (weight === "strong") {
          return html`<strong class="prose"><slot></slot></strong>`;
        } else {
          return html`<em class="prose"><slot></slot></em>`;
        }
      }
    },
    "uix-link": {
      props: {
        href: { type: String, defaultValue: "#" },
        content: { type: String, defaultValue: "" },
        external: { type: Boolean, defaultValue: false },
        variant: { 
          type: String, 
          defaultValue: "",
          enum: Variants 
        },
        underlineOnHover: { type: Boolean, defaultValue: false },
        icon: { type: String, defaultValue: null },
      },
      render: ({ href, content, external, variant, underlineOnHover, icon, }, { html }) => {
        const variantClass = ["link", LinkColors[variant],underlineOnHover ? "hover:underline" : ""].filter(cls => !!cls).join(" ");
        const externalAttrs = external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : "";
    
        return html`
          <a href=${href}
             class=${variantClass}
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
