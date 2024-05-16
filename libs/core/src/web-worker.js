import { fetchDataFromDB, postMessage } from "./backend/controller.js";

export const events = {};

let dataChannel;

// onmessage = (e) => {
//   if ("serviceWorker" in navigator && e.data.bridge) {
//     console.log("send message to service worker");
//     navigator.serviceWorker.controller.postMessage(e.data);
//   }
// };

const dispatch = (event) => {
  const message = JSON.parse(event.data);
  const { type, ...payload } = message;
  const handler = events[type];
  if (handler) {
    handler(payload);
  } else {
    console.warn("DEBUG: No handler registered for message type:", type);
  }
};

export const registerEvent = (type, handler) => {
  events[type] = handler;
};

const syncRequest = async ({ appId, models }) => {
  console.log("DEBUG: Sync request received:", { appId, models });
  const data = await fetchDataFromDB(appId, models);
  dataChannel.send(JSON.stringify({ type: "SYNC_DATA", data, appId: appId }));
};

const syncData = async ({ data, appId }) => {
  console.log("DEBUG: Sync data received:", data);
  postMessage({
    type: "SYNC_DATA",
    appId,
    data,
    bridge: true
  });
};

const requestUpdate = async ({ store }) => {
  console.log("DEBUG: Request Update from Reactive Record:", { store });
  postMessage({
    type: "REQUEST_UPDATE",
    bridge: true,
    requestUpdate: true
  });
};

const handleOplogWrite = async ({ store, key, value }) => {
  console.log("DEBUG: Oplog write received:", { store, key, value });
  postMessage({
    type: "OPLOG_WRITE",
    store,
    key,
    value,
    bridge: true,
    requestUpdate: true
  });
};

registerEvent("OPLOG_WRITE", handleOplogWrite);
registerEvent("REQUEST_UPDATE", requestUpdate);
registerEvent("SYNC_REQUEST", syncRequest);
registerEvent("SYNC_DATA", syncData);

let rtc;
let ws;

export const call = async (appId, userId, targetUsername, models) => {
  const onopenCallback = (dataChannel) => {
    dataChannel.send(
      JSON.stringify({
        type: "SYNC_REQUEST",
        appId,
        models
      })
    );
  };
  const dataChannel = rtc.createDataChannel("channel");
  console.log("DEBUG: DataChannel initial state:", dataChannel.readyState);
  dataChannel.onmessage = dispatch;

  dataChannel.onopen = () => {
    console.log("DEBUG: Data Channel is now open!");
    onopenCallback?.(dataChannel);
  };

  dataChannel.onerror = (error) => {
    console.error("DEBUG: DataChannel Error:", error);
  };

  rtc.oniceconnectionstatechange = () => {
    console.log("DEBUG: ICE Connection State:", rtc.iceConnectionState);
  };

  rtc.onsignalingstatechange = () => {
    console.log("DEBUG: Signaling State:", rtc.signalingState);
  };

  rtc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      console.log("DEBUG: Trying to connect to: " + targetUsername);
      ws.send(
        JSON.stringify({
          type: "ice-candidate",
          candidate,
          targetUsername: targetUsername
        })
      );
    }
  };

  const offer = await rtc.createOffer();
  await rtc.setLocalDescription(offer);
  console.log("DEBUG: DataChannel state:", dataChannel.readyState);
  ws.send(
    JSON.stringify({
      type: "offer",
      offer,
      fromUsername: [appId, userId].join("|"),
      targetUsername
    })
  );
  console.log("DEBUG: DataChannel initial state:", dataChannel.readyState);
  return Promise.resolve(dataChannel);
};

export const connect = (opts = {}) => {
  const {
    url = "ws://127.0.0.1:3030/ws",
    stunUrls = "stun:stun.l.google.com:19302",
    callback
  } = opts;

  const ondatachannel = (event) => {
    console.log("DEBUG: Connecting to Peer ...");
    dataChannel = event.channel;
    dataChannel.onmessage = dispatch;
    dataChannel.onopen = () => {
      console.log("DEBUG: Data Channel is now open!");
      if (callback) callback(dataChannel);
    };
    dataChannel.onerror = (error) => {
      console.error("DEBUG: DataChannel Error:", error);
    };
  };

  const username = opts.username;
  const configuration = {
    iceServers: [{ urls: stunUrls }]
  };
  ws = new WebSocket(url);
  rtc = new RTCPeerConnection(configuration);

  ws.onopen = () => {
    console.log("DEBUG: Connected to the server");
    ws.send(JSON.stringify({ type: "register", username }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
    case "offer":
      handleOffer(msg.offer, msg.fromUsername);
      break;
    case "answer":
      handleAnswer(msg.answer);
      break;
    case "ice-candidate":
      handleIceCandidate(msg.candidate);
      break;
    }
  };

  rtc.ondatachannel = ondatachannel;

  ws.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `DEBUG: Connection closed cleanly, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.log("DEBUG: Connection died");
    }
  };

  ws.onerror = (error) => {
    console.error(`WebSocket Error: ${error}`);
  };

  const handleOffer = (offer, fromUsername) => {
    rtc.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
      pendingCandidates.forEach((candidate) => {
        rtc.addIceCandidate(new RTCIceCandidate(candidate));
      });
      pendingCandidates = [];
    });
    rtc
      .createAnswer()
      .then((answer) => rtc.setLocalDescription(answer))
      .then(() => {
        console.log(
          "DEBUG: Sending answer:",
          rtc.localDescription,
          fromUsername
        );
        ws.send(
          JSON.stringify({
            type: "answer",
            answer: rtc.localDescription,
            targetUsername: fromUsername
          })
        );
      })
      .catch((e) => console.error("Error creating/sending answer:", e));
  };

  const handleAnswer = (answer) => {
    console.log("handleAnswer", { answer });
    rtc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  let pendingCandidates = [];
  const handleIceCandidate = (candidate) => {
    if (rtc.remoteDescription && rtc.remoteDescription.type) {
      rtc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => {
        console.error("DEBUG: Error adding ice candidate", e);
      });
    } else {
      console.log("DEBUG: HandleIceCandidate", { candidate });
      pendingCandidates.push(candidate);
    }
  };

  return {
    call,
    username
  };
};
