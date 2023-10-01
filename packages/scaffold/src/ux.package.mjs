import {
  AlignX,
  AlignY,
  BgOverlayOpacity,
  DirectionsClasses,
  Positions,
  Resolutions,
  NavbarPart,
  Layouts,
  Spacings,
  AnimationTypes,
  ModalPositions,
  Methods,
  Sizes,
  Shapes,
  Styles,
  Triggers,
  Directions,
  Formats,
  Variants,
  BgColor,
  TextColor,
  BorderColor,
  CheckboxVariant,
  CheckboxSize,
  CollapseBgColor,
  CollapseIcon,
  RingColor
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      props: {
        leftNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          width: { type: String, defaultValue: "200px" }
        },
        topNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] }
        },
        rightNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          width: { type: String, defaultValue: "200px" }
        },
        bottomNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] }
        }
      },
      render: ({ leftNavbar, topNavbar, rightNavbar, bottomNavbar }, { html }) => {
        return html`
          <div class="app-shell w-full h-full flex flex-col">
            ${topNavbar.items.length ? html`
              <uix-navbar variant=${topNavbar.bgColor} .items=${topNavbar.items}></uix-navbar>
            ` : ""}
            
            <div class="flex h-full">
              ${leftNavbar.items.length ? html`
                <uix-menu variant=${leftNavbar.bgColor} ?fullHeight=${true} .items=${leftNavbar.items} style="min-width: ${leftNavbar.width}"></uix-menu>
              ` : ""}
      
              <main class="content flex-grow">
                <slot></slot>
              </main>
      
              ${rightNavbar.items.length ? html`
                <uix-menu orientation="vertical" ?fullHeight=${true} variant=${rightNavbar.bgColor} .items=${rightNavbar.items} style="min-width: ${rightNavbar.width}"></uix-menu>
              ` : ""}
            </div>
            
            ${bottomNavbar.items.length ? html`
              <uix-navbar variant=${bottomNavbar.bgColor} .items=${bottomNavbar.items}></uix-navbar>
            ` : ""}
          </div>
        `;
      },
    }    
  }
};
      