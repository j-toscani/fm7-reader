import { RemoteInfo } from "dgram";
import base from "../assets/base";
import all from "../assets/all";
import decodeBuffer from "./decodeBuffer";
import fs from "fs";
import path from "path";

import wsServer from "../websocket";
import { WriteStream } from "fs";

let last = new Date();
const streams: { [key: string]: { stream: WriteStream; canStream: boolean } } =
  {};

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const toDecode = message.byteLength > 232 ? all : base;
  const decodedBuffer = decodeBuffer(message, toDecode);

  if (!decodedBuffer[0][1] || !shouldBroadcast(500)) {
    return;
  }

  if (!streams[remote.address]) {
    const stream = fs.createWriteStream(
      path.resolve(__dirname, "../../race_data/", remote.address + ".csv")
    );

    streams[remote.address] = {
      stream,
      canStream: true,
    };

    stream.on("finish", () => delete streams[remote.address]);
  }

  const values = decodedBuffer.map(([_key, value]) => value).join(",");

  streams[remote.address].canStream = writeToFile(
    streams[remote.address].stream,
    values + "\n"
  );
  // broadcastString(decodedBuffer);
  last = new Date();
}

function writeToFile(stream: WriteStream, message: string) {
  return stream.write(message);
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
