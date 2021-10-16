import { ObjectId } from "mongodb";
import { BaseRepo } from "../BaseRepo";

export type RaceDataRaw = {
  hash: string;
  data: Buffer[][];
  started: Date;
  ended?: Date;
  _id?: ObjectId;
};

export default class RaceDataRawRepo extends BaseRepo<RaceDataRaw> {
  constructor() {
    super("race_data_raw");
  }
  updateData(hash: string, message: Buffer) {
    this.collection.updateOne(
      { hash },
      { $push: { data: [message] }, $currentDate: { lastModified: true } }
    );
  }
}
