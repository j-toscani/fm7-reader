import { RemoteInfo } from "dgram";

export function onMessage(message: Buffer, remote: RemoteInfo) {
  const status = `${remote.address} : ${remote.port} - ${message}`;
  console.log(status);
}
