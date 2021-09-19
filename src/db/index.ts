import { MongoClient } from "mongodb";
import logger from "../utils/logger";

export default function connectToDb(url: string, onConnection: () => void) {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      logger.error("Could not connect to DB");
      logger.error(err);
      return;
    }
    onConnection();
    logger.info("Connected to Database!");
    client?.close();
    logger.info("Disconnected from Database!");
  });
}
