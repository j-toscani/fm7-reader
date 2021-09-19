import { Collection, MongoClient, Document } from "mongodb";
import logger from "../utils/logger";

export default function connectToDb(
  url: string,
  onConnection: (client: Collection<Document>) => void
) {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      logger.error("Could not connect to DB");
      logger.error(err);
      return;
    }
    if (client) {
      logger.info("Connected to Database!");
      const collection = client.db("fm7_raw").collection("race_data");
      onConnection(collection);
    }
  });
}
