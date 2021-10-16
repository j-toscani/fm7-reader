import http from "http";

// Error is expected as types are not correct! -> https://github.com/websockets/ws/issues/1932 -> https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55151
// @ts-expect-error
import WebSocket, { WebSocketServer } from "ws";
import RaceDataRawRepo from "../db/repos/RaceDataRaw";
import logger from "../utils/logger";

const socketServer = http.createServer((request, response) => {
  console.log("Request: ", request.url);
  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({ server: socketServer });

const connections: { [key: string]: RaceDataRawRepo } = {};

wss.on("connection", async (ws: WebSocket, request: Request) => {
  const hash = request.url.slice(1);
  logger.info(`Connection with hash ${hash} accepted.`);

  ws.on("message", (message: Buffer) => onMessage(hash, message));
  ws.on("close", () => {
    delete connections[hash];
    logger.info(`Connection with hash ${hash} closed.`);
  });
});

function onMessage(hash: string, message: Buffer) {
  let repo = connections[hash];

  if (!repo) {
    const newRepo = new RaceDataRawRepo();
    newRepo.create({ hash, data: [], started: new Date() });
    logger.info(`Connection with hash ${hash} created.`);
    repo = newRepo;
    connections[hash] = newRepo;
  }

  repo.updateData(hash, message);
}

export default socketServer;
