const generateId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return Array.from({ length: 5 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

export const connect = (opts = {}) => {
  const {
    url = "ws://127.0.0.1:3030/ws",
    stunUrls = "stun:stun.l.google.com:19302",
    ondatachannel,
  } = opts;

  const username = opts.username || generateId();
  const configuration = {
    iceServers: [{ urls: stunUrls }],
  };
  const ws = new WebSocket(url);
  const rtc = new RTCPeerConnection(configuration);

  ws.onopen = () => {
    console.log("Connected to the server");
    ws.send(JSON.stringify({ type: "register", username }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log({ msg });
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
        `Connection closed cleanly, code=${event.code}, reason=${event.reason}`,
      );
    } else {
      console.log("Connection died");
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
        console.log("Sending answer:", rtc.localDescription, fromUsername);
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
    console.log("handleIceCandidate");
    if (rtc.remoteDescription && rtc.remoteDescription.type) {
      rtc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => {
        console.error("Error adding ice candidate", e);
      });
    } else {
      console.log("HandleIceCandidate", { candidate });
      pendingCandidates.push(candidate);
    }
  };

  const call = async (targetUsername, callback) => {
    const dataChannel = rtc.createDataChannel("channel");
    console.log("DataChannel initial state:", dataChannel.readyState);
    dataChannel.onmessage = callback;

    dataChannel.onopen = () => {
      console.log("Data Channel is now open!");
      dataChannel.send("Hello, other side!");
    };

    dataChannel.onerror = (error) => {
      console.error("DataChannel Error:", error);
    };

    rtc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", rtc.iceConnectionState);
    };

    rtc.onsignalingstatechange = () => {
      console.log("Signaling State:", rtc.signalingState);
    };

    rtc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log("Trying to connect to: " + targetUsername);
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
    console.log("DataChannel state:", dataChannel.readyState);
    ws.send(
      JSON.stringify({
        type: "offer",
        offer,
        fromUsername: username,
        targetUsername,
      }),
    );
    console.log("DataChannel initial state:", dataChannel.readyState);
    return Promise.resolve(dataChannel);
  };

  return {
    call,
    username,
  };
};
