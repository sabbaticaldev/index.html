import { Server } from "https://deno.land/std@0.117.0/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std@0.117.0/ws/mod.ts";

const sockets = new Set();
const users = {};
const rooms = {};

const handler = async (req) => {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  try {
    const socket = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    });
    sockets.add(socket);

    for await (const event of socket) {
      const message = JSON.parse(event);
      const targetSocket = users[message.targetUsername]?.socket;
      if (typeof event === "string") {
        switch (message.type) {
        case "register":
          users[message.username] = {
            socket: socket,
            username: message.username,
          };
          await socket.send(
            JSON.stringify({
              type: "registered",
              success: true,
              message: "Registered successfully",
            }),
          );
          break;

        case "join-room":
          if (!rooms[message.roomId]) {
            rooms[message.roomId] = [];
          }
          rooms[message.roomId].push(socket);
          await socket.send(
            JSON.stringify({
              type: "joined-room",
              success: true,
              message: "Joined room successfully",
            }),
          );
          break;
        case "offer":
          if (targetSocket) {
            await targetSocket.send(
              JSON.stringify({
                type: "offer",
                offer: message.offer,
                fromUsername: message.username,
              }),
            );
          }
          break;

        case "answer":
          if (targetSocket) {
            await targetSocket.send(
              JSON.stringify({ type: "answer", answer: message.answer }),
            );
          }
          break;

        case "ice-candidate":
          if (targetSocket) {
            await targetSocket.send(
              JSON.stringify({
                type: "ice-candidate",
                candidate: message.candidate,
              }),
            );
          }
          break;
        }
      } else if (isWebSocketCloseEvent(event)) {
        const closedSocket = sockets.get(socket);
        if (closedSocket) {
          sockets.delete(closedSocket);

          for (const [username, user] of Object.entries(users)) {
            if (user.socket === socket) {
              delete users[username];
              break;
            }
          }

          for (const [roomId, sockets] of Object.entries(rooms)) {
            rooms[roomId] = sockets.filter((s) => s !== socket);
            if (rooms[roomId].length === 0) {
              delete rooms[roomId];
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(`failed to accept websocket: ${err}`);
    console.trace();
  }
};

const server = new Server({ port: 3000, handler });

console.log("WebSocket server is running on ws://localhost:3000/");
await server.listenAndServe();
