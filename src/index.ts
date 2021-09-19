import dgram from "dgram";
import dotenv from "dotenv";
import logger from "./utils/logger";
import socketServer from "./socket/websocket";
import { onMessage } from "./lib/onMessage";
import { createOnListening } from "./lib/createOnListening";
import connectToDb from "./db";

dotenv.config();

const server = dgram.createSocket("udp4");
const UDP_PORT = parseInt(process.env.UDP_PORT || "33333");
const WS_PORT = parseInt(process.env.WS_PORT || "33333");
const DB_URL = process.env.DB_URL || "mongodb://fm7-db:27017";
const HOST = "0.0.0.0";

socketServer.listen(WS_PORT, () =>
  logger.info({ message: `HTTP Server listening on Port ${WS_PORT}` })
);

connectToDb(DB_URL, (connection) => {
  server.on("listening", createOnListening(server));
  server.on("message", (message, info) => onMessage(message, info, connection));
  server.bind(UDP_PORT, HOST);
});
