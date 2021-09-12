import { Socket } from "dgram";
import logger from "../utils/logger";

export function createOnListening(server: Socket) {
  return () => {
    const address = server.address();
    logger.info("UDP Server listening on %s:%s", address.address, address.port);
  };
}
