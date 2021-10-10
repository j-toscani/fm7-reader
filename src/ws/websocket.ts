import http from "http";

// Error is expected as types are not correct! -> https://github.com/websockets/ws/issues/1932 -> https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55151
// @ts-expect-error
import WebSocket, { WebSocketServer } from "ws";
// import UserRepo, { User } from "../db/repos/User";
import RaceDataRawRepo from "../db/repos/RaceDataRaw";
import logger from "../utils/logger";

const socketServer = http.createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({ server: socketServer });

wss.on("connection", async (ws: WebSocket) => {
  ws.on("message", createOnMessage());
  ws.on("close", () => {
    console.log("connection closed");
  });
});

function createOnMessage() {
  let setUp = false;
  let findBy = { email: "", started: new Date() };
  let DataRepo: undefined | RaceDataRawRepo;

  return (data: WebSocket.Data) => {
    if (!setUp) {
      findBy.email = data.toString();
      DataRepo = new RaceDataRawRepo();
      const newEntry = {
        user: { email: findBy.email },
        data: [],
        started: new Date(),
      };
      DataRepo.create(newEntry);
      logger.info(
        [findBy.email, "started new session @", findBy.started].join("-")
      );
      setUp = true;
    } else if (DataRepo) {
      DataRepo?.updateData(findBy.email, findBy.started, data as Buffer);
    }
  };
}

export default socketServer;
