import dgram from "dgram";
const server = dgram.createSocket("udp4");

const PORT = 33333;
const HOST = "127.0.0.1";

server.on("listening", function () {
  const address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message, remote) {
  console.log(remote.address + ":" + remote.port + " - " + message);
});

server.bind(PORT, HOST);
