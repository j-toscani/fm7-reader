import base from "../assets/base";

export default function decodeBuffer(message: Buffer) {
  let byteToRead = 0;
  const decoder = createDecoder(message);

  const decodedTuples = [base[0]].map((option) => {
    const step = parseInt(option.encoding.slice(1)) / 4;
    const value = decoder(option.encoding, byteToRead);

    const data = [option.property, value];
    byteToRead += step;
    return data;
  });

  // return Object.fromEntries(decodedObject);
  return decodedTuples;
}

function createDecoder(message: Buffer) {
  return (encoding: string, byteToRead: number) => {
    switch (encoding) {
      case "f32":
        return message.readFloatBE(byteToRead);
      case "s32":
        return message.readInt32BE(byteToRead);

      default:
        return message.readFloatBE(byteToRead);
    }
  };
}
