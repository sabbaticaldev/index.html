import {
  Variants,
  Sizes,
  HeadingColors,
  LinkColors,
  FontWeight
} from "./style-props.mjs"; 


export default {  
  views: {
    
    "uix-heading": {
      props: {
        size: { type: String, defaultValue: "xl", enum: Sizes },
        variant: { type: String, defaultValue: "primary", enum: Variants },
        weight: { type: String, defaultValue: "semibold", enum: Variants },
        class: { type: String, defaultValue: "" }
      },
      render: (props, { html }) => {
        const { size, variant, weight } = props;
        const variantClass = HeadingColors[variant] + " prose";
        const weightClass = FontWeight[weight] || "";

        const HeadingTemplates = {
          "2xl": html`<h1 class="${variantClass} ${weightClass} text-5xl mt-0 mb-2 ${props.class}"><slot></slot></h1>`,
          "xl":  html`<h2 class="${variantClass} ${weightClass} text-3xl mt-0 mb-2 ${props.class}"><slot></slot></h2>`,
          "lg":  html`<h3 class="${variantClass} ${weightClass} text-2xl mt-0 mb-2 ${props.class}"><slot></slot></h3>`,
          "md":  html`<h4 class="${variantClass} ${weightClass} text-xl  mt-0 mb-2 ${props.class}"><slot></slot></h4>`,
          "sm":  html`<h5 class="${variantClass} ${weightClass} text-lg mt-0 mb-2 ${props.class}"><slot></slot></h5>`,
          "xs":  html`<h6 class="${variantClass} ${weightClass} text-base mt-0 mb-1 ${props.class}"><slot></slot></h6>`,          
          "":  html`<p class="${variantClass} ${weightClass} text-sm ${props.class}"><slot></slot></p>`
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
