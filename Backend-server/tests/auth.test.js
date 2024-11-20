// Backend-server/tests/auth.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../index');
const User = require('../userModel');

let mongoServer; // using in-memory database for tests

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.disconnect();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// 20 secs timeout
jest.setTimeout(20000); 

describe('POST /signup', () => {
  it('should create a new user and return a token', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'manager',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'manager',
    });

    const user = await User.findOne({ email: 'john@example.com' });
    expect(user).toBeTruthy();
    expect(user.name).toBe('John Doe');
  });

  it('should log in an existing user and return a token', async () => {
    // First, create a user for testing login
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'worker',
    });
  
    // Validate the user is saved correctly
    const savedUser = await User.findOne({ email: 'jane@example.com' });
    expect(savedUser).toBeTruthy();
    expect(savedUser.email).toBe('jane@example.com');
  
    // Attempt to log in with the created user
    const res = await request(app)
      .post('/login')
      .send({
        email: 'jane@example.com',
        password: 'password123', 
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'worker',
    });
  });  
});
