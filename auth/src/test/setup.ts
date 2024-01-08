import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

// tell typescript there is a global signin property
declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'foobar';
  // create a db
  mongo = await MongoMemoryServer.create();

  // get that database url
  const mongoUri = mongo.getUri();

  // connect to the database
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  // get mongo db and reset the data
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// create a signup test helper
global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};