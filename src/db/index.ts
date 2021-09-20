import { Collection, MongoClient, Document } from "mongodb";
import logger from "../utils/logger";

export default function connectToDb(
  url: string,
  onConnection: (client: Collection<Document>) => void
) {
  MongoClient.connect(url, async (err, client) => {
    if (err) {
      logger.error(err);
      return;
    }
    if (client) {
      logger.info("Connected to Database!");
      const db = client.db("fm7_raw");
      const connections = db.collection("connections");

      try {
        await connections.insertOne({ timestamp: Date.now() });
        logger.info("Created DB-Entry");

        const collection = db.collection("race_data");
        onConnection(collection);
      } catch (error) {
        logger.error(error);
      }
    }
  });
}
