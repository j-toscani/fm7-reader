import { MongoClient } from "mongodb";
import { BaseRepo } from "../BaseRepo";
import { User } from "./User";

export type RaceDataRaw = {
  user: User;
  data: Buffer[];
};

export default class RaceDataRepo extends BaseRepo<RaceDataRaw> {
  constructor(client: MongoClient) {
    super(client, "race_data_raw");
  }
  updateData(email: string, message: Buffer) {
    this.collection.updateOne(
      { user: { email } },
      { $push: { data: [message] }, $currentDate: { lastModified: true } }
    );
  }
}
