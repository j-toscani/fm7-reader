import { Socket } from "dgram";

export function createOnListening(server: Socket) {
  return () => {
    const address = server.address();
    const message = `UDP Server listening on ${address.address}: ${address.port}`;
    console.log(message);
  };
}
