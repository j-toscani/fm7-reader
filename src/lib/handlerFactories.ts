import { Socket } from "dgram";
import { connection } from "websocket";

export function createOnListening(server: Socket) {
  return () => {
    const address = server.address();
    const message = `UDP Server listening on ${address.address}: ${address.port}`;
    console.log(message);
  };
}

export function createHandleWsClose(connection: connection) {
  return () => {
    const { remoteAddress } = connection;
    const message = new Date() + " Peer " + remoteAddress + " disconnected.";
    console.log(message);
  };
}