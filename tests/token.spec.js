// tests/token.test.js

const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
// const { generateAccessToken } = require('../controllers/UserController');

const prisma = new PrismaClient();

describe('Token Generation', () => {
  it('should generate a token that expires correctly', () => {
    const user = {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toEqual(user.userId);
   expect(decoded.email).toEqual(user.email);

   const exp = new Date(decoded.exp * 1000);
   const now = new Date();
   const diff = exp.getTime() - now.getTime();

   // Allowing a margin of 1 second for test execution time
   expect(diff).toBeLessThanOrEqual(3600 * 1000 + 1000); 
  });

});

 