import { ReactiveRecord, defineModels } from "./model/reactive-record.mjs";
import { defineControllers, defineController } from "./controller/reactive-controller.mjs";
import bootstrapp from "./bootstrapp.mjs";
const ws = new WebSocket("ws://127.0.0.1:3030/ws");

ws.onopen = () => {
  console.log("Connected to the server");
  // Send a registration message or any initialization message here if needed
};

ws.onmessage = (event) => {
  console.log(event.data);
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

function handleOffer(offer, fromUsername) {
  pc.setRemoteDescription(new RTCSessionDescription(offer));
  pc.createAnswer()
    .then((answer) => pc.setLocalDescription(answer))
    .then(() => {
      ws.send(
        JSON.stringify({
          type: "answer",
          answer: pc.localDescription,
          targetUsername: fromUsername,
        }),
      );
    });
}

function handleAnswer(answer) {
  pc.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleIceCandidate(candidate) {
  pc.addIceCandidate(new RTCIceCandidate(candidate));
}

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
const pc = new RTCPeerConnection(configuration);

const targetUsername = "testconnection";

pc.onicecandidate = ({ candidate }) => {
  ws.send(
    JSON.stringify({
      type: "ice-candidate",
      candidate: candidate,
      targetUsername: targetUsername,
    }),
  );
};

// To initiate a call:
async function call(targetUsername) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  console.log("let's seee");
  ws.send(
    JSON.stringify({
      type: "offer",
      offer: offer,
      targetUsername: targetUsername,
    }),
  );
}

call(targetUsername);
export { defineController, defineControllers, defineModels, ReactiveRecord, bootstrapp, ws };
