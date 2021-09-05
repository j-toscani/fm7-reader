import { server as WebSocketServer, connection } from "websocket";
import http from "http";

var server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = getConnection(request);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", createHandleMessage(connection));
  connection.on("close", createHandleWsClose(connection));
});

function getConnection(request: any): connection {
  return request.accept("echo-protocol", request.origin);
}

function createHandleMessage(connection: connection) {
  return (message: any) => {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      connection.sendBytes(message.binaryData);
    }
  };
}

function createHandleWsClose(connection: connection) {
  return (reasonCode: number, description: string) => {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  };
}
