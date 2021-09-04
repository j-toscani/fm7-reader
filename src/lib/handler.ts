import { RemoteInfo } from "dgram";
import base from "../assets/base";
import add from "../assets/add";
import { BufferKeysV1, BufferKeysV2, EncodingsV2, V2 } from "../types";

const all = [...base, ...add];

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const decodedBuffer = decodeBuffer(message);
  const status = `${remote.address} : ${remote.port} - Game is running: ${decodedBuffer.isRaceOn}`;
  console.log(status);
}

export default function decodeBuffer(message: Buffer) {
  let byteToRead = 0;
  const decoder = createDecoder(message);
  const toDecode = message.byteLength > 232 ? all : base;

  const keyValuePairs = toDecode.map((option) => {
    const value = decoder(option, byteToRead);
    byteToRead = getNextByteToRead(byteToRead, option.encoding);

    return [option.property, value];
  });

  return Object.values(keyValuePairs) as unknown as {
    [key in BufferKeysV1 | BufferKeysV2]: number;
  };
}

function getNextByteToRead(prev: number, encoding: EncodingsV2) {
  return prev + parseInt(encoding.slice(1)) / 8;
}

function createDecoder(message: Buffer) {
  return (option: V2[number], byteToRead: number) => {
    if (byteToRead >= message.byteLength) {
      console.error("Exceeded byte length!");
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
