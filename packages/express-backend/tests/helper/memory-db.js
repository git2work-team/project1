import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let server;

// Starts a MongoDB that only lives in memory and connects mongoose to it
export async function connect() {
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
  // wait for unique indexes to be built so duplicate checks work in the tests
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
}

// Empties every collection so each test starts with a clean database
export async function clear() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

export async function close() {
  await mongoose.disconnect();
  await server.stop();
}

// A random id that is not in the database
export function newId() {
  return new mongoose.Types.ObjectId().toString();
}
