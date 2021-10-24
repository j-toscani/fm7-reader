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
  updateData(query: { hash: string; started: Date }, message: Buffer) {
    this.collection.updateOne(query, {
      $push: { data: [message] },
      $currentDate: { lastModified: true },
    });
  }
}
