import http from "http";

// Error is expected as types are not correct! -> https://github.com/websockets/ws/issues/1932 -> https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55151
// @ts-expect-error
import WebSocket, { WebSocketServer } from "ws";
import UserRepo, { User } from "../db/repos/User";
import RaceDataRawRepo from "../db/repos/RaceDataRaw";

const connections: { [key: string]: RaceDataRawRepo } = {};

const socketServer = http.createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({ server: socketServer });

function setUpWSS() {
  wss.on("connection", async (ws: WebSocket, request: Request) => {
    const user = await getUser(request);

    if (user) {
      ws.on("message", createOnMessage(user));
      ws.on("close", () => {
        delete connections[user.email];
      });
    }
  });
}

async function getUser(request: Request) {
  const { email } = request.body;
  const repo = new UserRepo();
  return repo.getOne({ email });
}

function createOnMessage(user: User) {
  const dataRepo = new RaceDataRawRepo();
  connections[user.email] = dataRepo;
  dataRepo.create({ user, data: [], started: new Date() });

  return (message: Buffer | string) => {
    if (message instanceof Buffer) {
      dataRepo.updateData(user.email, message);
    }
  };
}

export default socketServer;
