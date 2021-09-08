import http from "http";

// Error is expected as types are not correct! -> https://github.com/websockets/ws/issues/1932 -> https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55151
// @ts-expect-error
import {WebSocketServer} from "ws";

const server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wss = new WebSocketServer({ server });

export default wss;