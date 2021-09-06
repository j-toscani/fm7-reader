import { RemoteInfo } from "dgram";
import base from "../assets/base";
import all from "../assets/all";
import decodeBuffer from "./decodeBuffer";

import wsServer from "../websocket";

let last = new Date();

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const toDecode = message.byteLength > 232 ? all : base;
  const decodedBuffer = decodeBuffer(message, toDecode);

  if (shouldBroadcast(50)) {
    console.log(new Date().getTime());
    broadcastString(decodedBuffer);
    last = new Date();
  }
}

function broadcastString(data: any) {
  wsServer.connections.forEach((connection) => {
    const stringifiedData = JSON.stringify(data);
    connection.sendUTF(stringifiedData);
  });
}

function shouldBroadcast(interval: number) {
  const now = new Date();
  return now.getTime() - last.getTime() > interval;
}
