import dgram from "dgram";
import http, { IncomingMessage, ServerResponse } from 'http';
import { onMessage } from "./lib/handler";
import { createOnListening } from "./lib/handlerFactories";

const server = dgram.createSocket("udp4");

const PORT = 33333;
const HOST = "0.0.0.0";

const requestListener = function (req:IncomingMessage, res:ServerResponse) {
  res.writeHead(200);
  res.end('Hello, World!');
}

const httpServer = http.createServer(requestListener)

server.on("listening", createOnListening(server));

server.on("message", onMessage);

export function startServer() {
  server.bind(PORT, HOST);
  // httpServer.listen(PORT)
}
