import { handleFetch, messageHandler, P2P, requestUpdate } from "./index.js";
import { startBackend } from "./libs/appstate.js";
import idbAdapter from "./libs/indexeddb.js";
self.messageHandler = messageHandler;
self.P2P = P2P;
self.requestUpdate = requestUpdate;
self.startBackend = startBackend;
self.handleFetch = handleFetch;
self.idbAdapter = idbAdapter;
