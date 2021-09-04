import { RemoteInfo } from "dgram";
import base from "../assets/base";
import add from "../assets/add";
import { BufferKeysV1, BufferKeysV2, V2 } from "../types";

const all = [...base, ...add];

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const decodedBuffer = decodeBuffer(message, remote.size);
  const status = `${remote.address} : ${remote.port} - Game is running: ${decodedBuffer.isRaceOn}`;
  console.log(status);
}

export default function decodeBuffer(message: Buffer, maxSize: number) {
  let byteToRead = 0;
  const decoder = createDecoder(message, maxSize);

  const toDecode = maxSize > 232 ? all : base;
  const decodedBuffer: { [key in BufferKeysV1 | BufferKeysV2]?: number } = {};

  toDecode.forEach((option) => {
    const step = parseInt(option.encoding.slice(1)) / 8;
    const value = decoder(option, byteToRead);

    decodedBuffer[option.property] = value;
    byteToRead += step;
  });

  return decodedBuffer as { [key in BufferKeysV1 | BufferKeysV2]: number };
}

function createDecoder(message: Buffer, maxSize: number) {
  return (option: V2[number], byteToRead: number) => {
    if (byteToRead >= maxSize) {
      return;
    }

    switch (option.encoding) {
      case "f32":
        return message.readFloatBE(byteToRead);
      case "u32":
        return message.readInt32LE(byteToRead);
      case "u16":
        return message.readInt16LE(byteToRead);
      case "s8":
        return message.readInt8(byteToRead);
      case "u8":
        return message.readUInt8(byteToRead);
      case "s32":
        return message.readInt32BE(byteToRead);
      default:
        throw Error("Unknown decoding");
    }
  };
}
