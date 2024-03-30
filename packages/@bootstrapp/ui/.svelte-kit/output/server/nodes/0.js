

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.01d7315a.js","_app/immutable/chunks/Component.6f41b37e.js","_app/immutable/chunks/index.0fe306af.js"];
export const stylesheets = [];
export const fonts = [];
