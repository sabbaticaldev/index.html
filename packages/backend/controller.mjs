export const connect = ({
  url = "ws://127.0.0.1:3030/ws",
  username,
  stunUrls = "stun:stun.l.google.com:19302",
}) => {
  if (!username) {
    throw new Error("Username must be provided.");
  }

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

  ws.onclose = (event) => {
    console.log("onclose called");
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
    console.log("handleOffer", { fromUsername });
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

  let dataChannel;
  const call = async (targetUsername) => {
    dataChannel = rtc.createDataChannel("channel");
    console.log("DataChannel initial state:", dataChannel.readyState);
    dataChannel.onmessage = (event) => {
      console.log("Received data:", event.data);
    };

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

  rtc.ondatachannel = (event) => {
    if (!dataChannel) {
      dataChannel = event.channel;
    }

    dataChannel.onmessage = (event) => {
      console.log("Received data:", event.data);
    };
    dataChannel.onopen = () => {
      console.log("Data Channel is now open!");
      dataChannel.send("side, Hello Other!");
    };
    dataChannel.onerror = (error) => {
      console.error("DataChannel Error:", error);
    };
  };

  return {
    call,
    dataChannel,
  };
};
