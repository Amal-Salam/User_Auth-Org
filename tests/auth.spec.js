// tests/organisation.test.js
 const app = require('../server');
 
 const { PrismaClient } = require('@prisma/client');
 const request = require('supertest');

 const prisma = new PrismaClient();

describe('Authentication and Organization Endpoints', () => {
  beforeAll(async () => {
    await prisma.organisationsOnUsers.deleteMany();
    await prisma.organisation.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let token;
  let userId;
  let orgId;

  
  test('It Should Register User Successfully with Default Organisation', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.lastName).toBe('Doe');
    expect(res.body.data.user.email).toBe('john.doe@example.com');

    token = res.body.data.accessToken;
    userId = res.body.data.user.userId;
  }, 10000);

  test('It Should Log the user in successfully', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'damon.salvatore@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.lastName).toBe('Doe');
    expect(res.body.data.user.email).toBe('john.doe@example.com');

    token = res.body.data.accessToken;
  });

  test('It Should Fail If Required Fields Are Missing', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('It Should Fail if there’s Duplicate Email or UserID', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'Klaus',
      lastName: 'Mikealson',
      email: 'klaus.Mikealson@example.com',
      password: 'original123',
      phone: '1234567890',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('Bad request');
  });

  test('It Should Create a New Organisation', async () => {
    const res = await request(app)
      .post('/api/organisations')
      .set('Authorization', `${token}`)
      .send({
        name: 'New Organisation',
        description: 'Description of the new organisation',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.name).toBe('New Organisation');
    expect(res.body.data.description).toBe(
      'Description of the new organisation'
    );

    orgId = res.body.data.orgId;
  }, 10000);
});


