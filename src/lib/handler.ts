import { RemoteInfo } from "dgram";

import decodeBuffer from "./decodeBuffer";
import { RaceDataStream } from "./RaceDataStream";

const streams: { [key: string]: RaceDataStream } = {};

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const decodedBuffer = decodeBuffer(message);
  const stream = streams[remote.address];

  if (!decodedBuffer[0][1] && stream) {
    stream.stop();
    return;
  }

  if (!decodedBuffer[0][1] || !stream.shouldWrite(500)) {
    return;
  }

  if (!stream) {
    streams[remote.address] = new RaceDataStream(remote);
  }

  if (stream.canStream) {
    const values = decodedBufferToString(decodedBuffer);
    stream.write(values);
  } else {
    stream.haltToDrain();
  }
}

function decodedBufferToString(decoded: ReturnType<typeof decodeBuffer>) {
  return decoded.map(([_key, value]) => value).join(",");
}
