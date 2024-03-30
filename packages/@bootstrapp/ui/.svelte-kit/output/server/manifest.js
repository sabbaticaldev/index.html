export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.a1df6241.js","app":"_app/immutable/entry/app.bfa1ead3.js","imports":["_app/immutable/entry/start.a1df6241.js","_app/immutable/chunks/Component.6f41b37e.js","_app/immutable/chunks/singletons.2db6d528.js","_app/immutable/entry/app.bfa1ead3.js","_app/immutable/chunks/Component.6f41b37e.js","_app/immutable/chunks/index.0fe306af.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
