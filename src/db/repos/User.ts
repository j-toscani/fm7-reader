import { MongoClient } from "mongodb";
import { BaseRepo } from "../BaseRepo";

export type User = {
  email: string;
  pw: string;
};

export default class UserRepo extends BaseRepo<User> {
  constructor(client: MongoClient) {
    super(client, "users");
  }
}
