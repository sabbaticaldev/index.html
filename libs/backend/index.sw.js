import { startBackend } from "./appstate/index.js";
import { handleFetch, messageHandler, P2P, requestUpdate  } from "./index.js";
import idbAdapter from "./indexeddb/index.js";
self.messageHandler = messageHandler;
self.P2P = P2P;
self.requestUpdate = requestUpdate;
self.startBackend = startBackend;
self.handleFetch = handleFetch;
self.idbAdapter = idbAdapter;