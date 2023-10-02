import {
  BgColor,
  TextColor,
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      props: {
        topNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          height: { type: String, defaultValue: "h-16" },
        },
        leftNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },          
          width: { type: String, defaultValue: "w-72" },
        },
        rightNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          width: { type: String, defaultValue: "w-72" },
        },
        bottomNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          height: { type: String, defaultValue: "h-16" },
        }
      },
      render: ({ leftNavbar, topNavbar, rightNavbar, bottomNavbar }, { html }) => {
        
        return html`
          <div class="app-shell w-full h-full flex flex-col">
            ${topNavbar.items.length ? html`
              <uix-navbar padding="p-0" variant=${topNavbar.bgColor} height=${topNavbar.height || "h-16"} .items=${topNavbar.items}></uix-navbar>
            ` : ""}
            
            <div class="flex h-full">
              ${leftNavbar.items.length ? html`
                <uix-menu variant=${leftNavbar.bgColor} fullHeight width=${leftNavbar.width} .items=${leftNavbar.items}></uix-menu>
              ` : ""}
      
              <main class="content flex-grow">
                <slot></slot>
              </main>
      
              ${rightNavbar.items.length ? html`
                <uix-menu orientation="vertical" fullHeight variant=${rightNavbar.bgColor} width=${rightNavbar.width} .items=${rightNavbar.items}></uix-menu>
              ` : ""}
            </div>
            
            ${bottomNavbar.items.length ? html`
              <uix-navbar padding="p-0" variant=${bottomNavbar.bgColor} height=${bottomNavbar.height  || "h-16"} .items=${bottomNavbar.items}></uix-navbar>
            ` : ""}
          </div>
        `;
      },
    }    
  }
};
      