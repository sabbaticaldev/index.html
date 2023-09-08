import { registerSW } from "virtual:pwa-register";
const api = {};

console.log("is this wroking?");

registerSW({
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered: ", swScriptUrl);
  },
  onOfflineReady() {
    console.log("PWA application ready to work offline");
  },
  fetch(event) {
    const url = new URL(event.request.url);

    if (api[url.pathname]) {
      console.log(url.pathname, api[url.pathname] || socket[url.pathname]);

      event.respondWith(
        new Response(JSON.stringify(api[url.pathname]), {
          headers: { "Content-Type": "application/json" },
        })
      );
    }
  },
});
