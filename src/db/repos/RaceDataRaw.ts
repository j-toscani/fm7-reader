import { ObjectId } from "mongodb";
import { BaseRepo } from "../BaseRepo";
import { User } from "./User";

export type RaceDataRaw = {
  user: Partial<User>;
  data: Buffer[][];
  started: Date;
  ended?: Date;
  _id?: ObjectId;
};

export default class RaceDataRawRepo extends BaseRepo<RaceDataRaw> {
  constructor() {
    super("race_data_raw");
  }
  updateData(email: string, started: Date, message: Buffer) {
    this.collection.updateOne(
      { user: { email }, started },
      { $push: { data: [message] }, $currentDate: { lastModified: true } }
    );
  }
}
