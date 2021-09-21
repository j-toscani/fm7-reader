import { MongoClient } from "mongodb";

export class BaseRepo<T> {
  client: MongoClient;
  collectionName: string;

  constructor(client: MongoClient, collectionName: string) {
    this.client = client;
    this.collectionName = collectionName;
  }

  get collection() {
    return this.client.db("fm7").collection(this.collectionName);
  }

  update(user: Partial<T>) {
    this.collection.updateOne(user, { $set: user });
  }
  get(user: Partial<T>) {
    this.collection.findOne(user);
  }
  create(user: T) {
    this.collection.insertOne(user);
  }
  delete(user: Partial<T>) {
    this.collection.deleteOne(user);
  }
}
