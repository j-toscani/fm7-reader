import dgram from "dgram";
import dotenv from "dotenv";
import logger from "./utils/logger";
import socketServer from "./socket/websocket";
import { connectDatabase } from "./db";

dotenv.config();

const UDP_PORT = parseInt(process.env.UDP_PORT || "33333");
const WS_PORT = parseInt(process.env.WS_PORT || "33333");

const DB_PW = process.env.DB_PW ?? "admin";
const DB_USER = process.env.DB_USER ?? "admin";

const DB_URL = `mongodb://${DB_USER}:${DB_PW}@fm7-db:27017/?authSource=admin`; //   process.env.DB_URL ||
// const HOST = "0.0.0.0";

connectDatabase(DB_URL).then(() => {});
