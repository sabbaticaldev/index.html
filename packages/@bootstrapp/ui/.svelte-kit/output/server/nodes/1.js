

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.7bf477ff.js","_app/immutable/chunks/Component.6f41b37e.js","_app/immutable/chunks/index.0fe306af.js","_app/immutable/chunks/singletons.2db6d528.js"];
export const stylesheets = [];
export const fonts = [];
