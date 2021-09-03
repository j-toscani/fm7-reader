import dgram from "dgram";
import { onMessage } from "./lib/handler";
import { createOnListening } from "./lib/handlerFactories";

const server = dgram.createSocket("udp4");

const PORT = 33333;
const HOST = "127.0.0.1";

server.on("listening", createOnListening(server));

server.on("message", onMessage);

server.bind(PORT, HOST);
