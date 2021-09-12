import { RemoteInfo } from "dgram";

import decodeBuffer, {
  createDecoder,
  Decoder,
  isGameRunning,
} from "./decodeBuffer";

import { RaceDataStream } from "./RaceDataStream";

const streams: { [key: string]: RaceDataStream } = {};

export function onMessage(message: Buffer, remote: RemoteInfo) {
  let stream = streams[remote.address];

  if (stream && !stream.shouldWrite(500)) {
    return;
  }

  const decoder = createDecoder(message);
  const isRunning = isGameRunning(message, decoder);

  if (!isRunning) {
    stream?.stop();
    return;
  }

  if (!stream) {
    createStream(remote);
  }

  if (stream.canStream) {
    stream.write(getValues(message, decoder));
  }
}

function createStream(remote: RemoteInfo) {
  const onFinish = () => delete streams[remote.address];
  streams[remote.address] = new RaceDataStream(remote, onFinish);
  return streams[remote.address];
}

function getValues(message: Buffer, decoder: Decoder) {
  const decodedBuffer = decodeBuffer(message, decoder);
  return decodedBufferToString(decodedBuffer);
}

function decodedBufferToString(decoded: ReturnType<typeof decodeBuffer>) {
  return decoded.map(([_key, value]) => value).join(",") + "\n";
}
