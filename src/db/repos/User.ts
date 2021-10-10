import { MongoClient, ObjectId } from "mongodb";
import { BaseRepo } from "../BaseRepo";

export type User = {
  email: string;
  pw: string;
  _id: ObjectId;
};

export default class UserRepo extends BaseRepo<User> {
  constructor() {
    super("users");
  }
}
