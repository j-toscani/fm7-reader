import dgram from "dgram";
import { onMessage } from "./lib/onMessage";
import { createOnListening } from "./lib/createOnListening";
import logger from "./utils/logger";

const server = dgram.createSocket("udp4");

const PORT = 33333;
const HOST = "0.0.0.0";

server.on("listening", createOnListening(server));

server.on("message", onMessage);

server.bind(PORT, HOST);
