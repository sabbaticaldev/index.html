import { P2P } from "./sync.mjs";

export const connect = (opts = {}) => {
  const {
    url = "ws://127.0.0.1:3030/ws",
    stunUrls = "stun:stun.l.google.com:19302",
  } = opts;
  const ondatachannel = (event) => {
    console.log("DEBUG: Connecting to Peer ...");
    const dataChannel = event.channel;
    dataChannel.onmessage = (event) => P2P.dispatch(event, { dataChannel });
    dataChannel.onopen = () => {
      console.log("DEBUG: Data Channel is now open!");
    };
    dataChannel.onerror = (error) => {
      console.error("DEBUG: DataChannel Error:", error);
    };
  };

  const username = opts.username;
  const configuration = {
    iceServers: [{ urls: stunUrls }],
  };
  const ws = new WebSocket(url);
  const rtc = new RTCPeerConnection(configuration);

  ws.onopen = () => {
    console.log("DBUG: Connected to the server");
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
        `DEBUG: Connection closed cleanly, code=${event.code}, reason=${event.reason}`,
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
          fromUsername,
        );
        ws.send(
          JSON.stringify({
            type: "answer",
            answer: rtc.localDescription,
            targetUsername: fromUsername,
          }),
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

  const call = async (appId, targetUsername, models) => {
    const onopenCallback = (dataChannel) => {
      dataChannel.send(
        JSON.stringify({
          type: "SYNC_REQUEST",
          appId,
          models,
        }),
      );
    };
    const dataChannel = rtc.createDataChannel("channel");
    console.log("DEBUG: DataChannel initial state:", dataChannel.readyState);
    dataChannel.onmessage = (event) => P2P.dispatch(event, { dataChannel });

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
            targetUsername: targetUsername,
          }),
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
        fromUsername: username,
        targetUsername,
      }),
    );
    console.log("DEBUG: DataChannel initial state:", dataChannel.readyState);
    return Promise.resolve(dataChannel);
  };

  return {
    call,
    username,
  };
};
