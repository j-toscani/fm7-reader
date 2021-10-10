import { getCollection } from ".";
import { User } from "./repos/User";

export abstract class BaseRepo<T> {
  collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  get collection() {
    return getCollection<T>(this.collectionName);
  }

  update(entry: Partial<T>) {
    return this.collection.updateOne(entry, { $set: entry });
  }
  getOne(entry: Partial<T>) {
    return this.collection.findOne(entry);
  }
  create(entry: T) {
    // necessary because: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46375
    //@ts-expect-error
    return this.collection.insertOne(entry);
  }
  delete(entry: Partial<T>) {
    return this.collection.deleteOne(entry);
  }
}
