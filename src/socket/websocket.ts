import http from "http";

// Error is expected as types are not correct! -> https://github.com/websockets/ws/issues/1932 -> https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55151
// @ts-expect-error
import WebSocket, { WebSocketServer } from "ws";
import decodeBuffer, { createDecoder } from "../lib/decodeBuffer";
import { decodedBufferToString } from "../lib/onMessage";
import { RaceDataStream } from "../lib/RaceDataStream";

const socketServer = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({ server: socketServer });

wss.on("connection", (ws: WebSocket, request: any) => {
  const stream = new RaceDataStream(
    {
      address: request.headers.host,
      family: "IPv4",
      port: 5000,
      size: 321,
    },
    () => {
      console.log("finished");
    }
  );
  ws.on("message", (message) => {
    if (message instanceof Buffer) {
      const decoder = createDecoder(message);

      const messageString = decodeBuffer(message, decoder);
      stream.write(decodedBufferToString(messageString));
    }
  });
});

export default socketServer;
