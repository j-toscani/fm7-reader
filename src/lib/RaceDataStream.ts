import { RemoteInfo } from "dgram";
import fs, { WriteStream } from "fs";
import path from "path";
import logger from "../utils/logger";

export class RaceDataStream {
  canStream: boolean;
  filename: string;
  stream: WriteStream;
  last: Date;

  constructor(remote: RemoteInfo, onFinish: () => void) {
    const [stream, filename] = this._setupStream(remote, onFinish);
    this.filename = filename;
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

  private _setupStream(remote: RemoteInfo, onFinish: () => void) {
    const filename = createFileName(remote);

    const stream = fs.createWriteStream(
      path.resolve(__dirname, "../../race_data/", filename),
      { flags: "a" }
    );

    logger.info("Writing to %s", filename);

    stream.on("drain", () => {
      this.canStream = true;
      logger.warn("%s buffer is draining!", remote.address);
    });
    stream.on("finish", () => {
      onFinish();
      logger.info("%s, disconnected at %s", remote.address);
    });

    return [stream, filename] as const;
  }
}

function createFileName(remote: RemoteInfo) {
  const ip = remote.address;
  const formatter = createFormatter();
  return `${formatter.format(new Date())}_${ip}.csv`;
}

function createFormatter() {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
