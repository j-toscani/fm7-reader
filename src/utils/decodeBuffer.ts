import base from "../assets/base";

export default function decodeBuffer(message: Buffer) {
  let byteToRead = 0;
  const decoder = createDecoder(message);

  const decodedObject = base.map((option) => {
    const step = parseInt(option.encoding.slice(1)) / 4;
    const value = decoder(option.encoding, byteToRead);

    const data = [option.property, value];
    byteToRead += step;
    return data;
  });

  return Object.fromEntries(decodedObject);
}

function createDecoder(message: Buffer) {
  return (encoding: string, byteToRead: number) => {
    switch (encoding) {
      case "f32":
        return message.readFloatBE(byteToRead);

      default:
        return message.readFloatBE(byteToRead);
    }
  };
}
