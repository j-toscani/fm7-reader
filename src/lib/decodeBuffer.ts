import { EncodingsV2, V2 } from "../types";

import base from "../assets/base";
import all from "../assets/all";

export default function decodeBuffer(message: Buffer) {
  const optionsToDecode = getOptionsToDecode(message);
  const decoder = createDecoder(message);
  let byteToRead = 0;

  const keyValuePairs = optionsToDecode.map((option) => {
    const value = decoder(option, byteToRead);
    byteToRead = getNextByteToRead(byteToRead, option.encoding);

    return [option.property, value];
  });

  return keyValuePairs;
}

function getNextByteToRead(prev: number, encoding: EncodingsV2) {
  return prev + parseInt(encoding.slice(1)) / 8;
}

function getOptionsToDecode(message: Buffer) {
  return message.byteLength > 232 ? all : base;
}

function createDecoder(message: Buffer) {
  return (option: V2[number], byteToRead: number) => {
    if (byteToRead >= message.byteLength) {
      console.error("Exceeded byte length!");
      return;
    }

    switch (option.encoding) {
      case "f32":
        return message.readFloatLE(byteToRead);
      case "u32":
        return message.readUInt32LE(byteToRead);
      case "u16":
        return message.readUInt16LE(byteToRead);
      case "s8":
        return message.readInt8(byteToRead);
      case "u8":
        return message.readUInt8(byteToRead);
      case "s32":
        return message.readInt32LE(byteToRead);
      default:
        throw Error("Unknown decoding");
    }
  };
}
