import { RemoteInfo } from "dgram";
import decodeBuffer from "../utils/decodeBuffer";

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const [readableMessage] = decodeBuffer(message);
  const string = `${readableMessage[0]}: ${Boolean(readableMessage[1])}`
  const status = `${remote.address} : ${remote.port} - ${string}`;
  console.log(status);
}
