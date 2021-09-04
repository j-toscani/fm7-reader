import dgram from "dgram";
import { Buffer } from "buffer";

const PORT = 33333;
const HOST = "192.168.0.171";

const message = Buffer.from("My KungFu is Good!");

const client = dgram.createSocket("udp4");

client.send(message, 0, message.length, PORT, HOST, sendMessage);

function sendMessage(err: Error | null, bytes: number) {
  if (err) throw err;
  console.log("UDP message sent to " + HOST + ":" + PORT);
  client.close();
}
