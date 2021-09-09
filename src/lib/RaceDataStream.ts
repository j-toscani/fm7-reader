import { RemoteInfo } from "dgram";
import fs, { WriteStream } from "fs";
import path from "path";

export class RaceDataStream {
  canStream: boolean;
  stream: WriteStream;
  last: Date;

  constructor(remote: RemoteInfo) {
    const stream = fs.createWriteStream(
      path.resolve(__dirname, "../../race_data/", remote.address + ".csv"),
      { flags: "a" }
    );

    this.canStream = true;
    this.stream = stream;
    this.last = new Date();
  }

  shouldWrite(interval: number) {
    const now = new Date();
    const timeToWrite = now.getTime() - this.last.getTime() > interval;

    if (timeToWrite) {
      this.last = now;
    }

    return timeToWrite;
  }

  stop() {
    this.stream.end();
  }

  write(message: string) {
    this.canStream = this.stream.write(message);
  }

  haltToDrain() {
    this.stream.on("drain", () => (this.canStream = true));
  }
}
