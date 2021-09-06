import { RemoteInfo } from "dgram";
import base from "../assets/base";
import all from "../assets/all";
import decodeBuffer from "./decodeBuffer";

import ws from "../websocket";

let last = new Date();

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const toDecode = message.byteLength > 232 ? all : base;
  const decodedBuffer = decodeBuffer(message, toDecode);
  
  if (shouldBroadcast(50)) {
    broadcastDecodedBuffer(decodedBuffer)
  }
}

function shouldBroadcast(interval: number) {
  const now = new Date();
  return now.getTime() - last.getTime() > interval;
}

function broadcastDecodedBuffer(buffer: ReturnType<typeof decodeBuffer>) {
  ws.clients.forEach((client: any) => {
    client.send(buffer);
  })
}
