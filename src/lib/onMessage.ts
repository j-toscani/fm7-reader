import { RemoteInfo } from "dgram";
import { Document, Collection } from "mongodb";

import decodeBuffer, {
  createDecoder,
  Decoder,
  isGameRunning,
} from "./decodeBuffer";

import { RaceDataStream } from "./RaceDataStream";

const streams: { [key: string]: RaceDataStream } = {};

export function onMessage(
  message: Buffer,
  remote: RemoteInfo,
  collection: Collection<Document>
) {
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
    streams[remote.address] = createStream(remote);
    stream = streams[remote.address];
  }

  if (stream.canStream) {
    stream.write(getValues(message, decoder));

    const toSave = {
      $push: { data: [message] },
      $currentDate: { lastModified: true },
      id: stream.filename.slice(0, stream.filename.length - 4),
    };

    collection
      .updateOne({ id: toSave.id }, toSave, { upsert: true })
      .then(() => console.log(Date.now(), ": saved!"))
      .catch((err) => console.error(err));
  }
}

function createStream(remote: RemoteInfo) {
  const onFinish = () => delete streams[remote.address];
  return new RaceDataStream(remote, onFinish);
}

function getValues(message: Buffer, decoder: Decoder) {
  const decodedBuffer = decodeBuffer(message, decoder);
  return decodedBufferToString(decodedBuffer);
}

export function decodedBufferToString(
  decoded: ReturnType<typeof decodeBuffer>
) {
  return decoded.map(([_key, value]) => value).join(",") + "\n";
}
