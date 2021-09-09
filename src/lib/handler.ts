import { RemoteInfo } from "dgram";

import decodeBuffer from "./decodeBuffer";
import { RaceDataStream } from "./RaceDataStream";

const streams: { [key: string]: RaceDataStream } = {};

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const decodedBuffer = decodeBuffer(message);
  let stream = streams[remote.address];

  if (!decodedBuffer[0][1] && stream) {
    stream.stop();
    return;
  }

  if (!decodedBuffer[0][1] || (stream && !stream.shouldWrite(500))) {
    return;
  }

  if (!stream) {
    const onFinish = () => delete streams[remote.address];
    streams[remote.address] = new RaceDataStream(remote, onFinish);
    stream = streams[remote.address];
  }

  if (stream.canStream) {
    const values = decodedBufferToString(decodedBuffer);
    stream.write(values);
  }
}

function decodedBufferToString(decoded: ReturnType<typeof decodeBuffer>) {
  return decoded.map(([_key, value]) => value).join(",") + "\n";
}
