import { RemoteInfo } from "dgram";
import base from "../assets/base";
import all from "../assets/all";
import decodeBuffer from "./decodeBuffer";

import wsServer from "../websocket";


export function onMessage(message: Buffer, _remote: RemoteInfo) {
  const toDecode = message.byteLength > 232 ? all : base;

  const decodedBuffer = decodeBuffer(message, toDecode);

  wsServer.connections.forEach(connection => {
    const data = JSON.stringify(decodedBuffer);
    connection.sendUTF(data);
  })
}

