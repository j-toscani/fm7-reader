import { ObjectId } from "mongodb";
import { BaseRepo } from "../BaseRepo";
import { User } from "./User";

export type RaceDataRaw = {
  user: User;
  data: Buffer[][];
  started: Date;
  ended?: Date;
  _id?: ObjectId;
};

export default class RaceDataRawRepo extends BaseRepo<RaceDataRaw> {
  constructor() {
    super("race_data_raw");
  }
  updateData(email: string, message: Buffer) {
    this.collection.updateOne(
      { user: { email } },
      { $push: { data: [message] }, $currentDate: { lastModified: true } }
    );
  }
}
