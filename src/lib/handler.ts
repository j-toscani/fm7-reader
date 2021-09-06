import { RemoteInfo } from "dgram";
import base from "../assets/base";
import all from "../assets/all";
import decodeBuffer from "./decodeBuffer";

import ws from "../websocket";


export function onMessage(message: Buffer, _remote: RemoteInfo) {
  const toDecode = message.byteLength > 232 ? all : base;

  const decodedBuffer = decodeBuffer(message, toDecode);

  ws.clients.forEach((client: any) => {
    client.send(decodedBuffer);
  })
}

