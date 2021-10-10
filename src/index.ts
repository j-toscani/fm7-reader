import dotenv from "dotenv";
import logger from "./utils/logger";
import socketServer from "./ws/websocket";
import { connectDatabase } from "./db";

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT || "33332");

const DB_PW = process.env.DB_PW ?? "admin";
const DB_USER = process.env.DB_USER ?? "admin";

const DB_URL =
  process.env.DB_URL ||
  `mongodb://${DB_USER}:${DB_PW}@fm7-db:27017/?authSource=admin`;

connectDatabase(DB_URL)
  .then(() => {
    logger.info("Connected to Database!");
    socketServer.listen(WS_PORT, () =>
      logger.info(`Server started on: ${WS_PORT}`)
    );
  })
  .catch((err) => logger.error(err));
