import { Collection, MongoClient } from "mongodb";

let client: MongoClient;

export async function connectDatabase(url: string): Promise<void> {
  client = new MongoClient(url);
  await client.connect();
}

export function getCollection<T>(name: string): Collection<T> {
  return client.db("fm7").collection<T>(name);
}
