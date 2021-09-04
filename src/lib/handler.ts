import { RemoteInfo } from "dgram";

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const mode = remote.size === 232 ? "sled" : "cardash";
  const status = `${remote.address} : ${remote.port} - ${message.readFloatBE(
    0
  )}`;
  console.log(status);
}
