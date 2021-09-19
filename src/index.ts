import dgram from "dgram";
import socketServer from "./websocket";
import { onMessage } from "./lib/onMessage";
import { createOnListening } from "./lib/createOnListening";
import logger from "./utils/logger";

const server = dgram.createSocket("udp4");

const PORT = 33333;
const HOST = "0.0.0.0";

server.on("listening", createOnListening(server));

server.on("message", onMessage);

socketServer.listen(33332, () =>
  logger.info({ message: "HTTP Server listening on Port 33332" })
);
server.bind(PORT, HOST);
