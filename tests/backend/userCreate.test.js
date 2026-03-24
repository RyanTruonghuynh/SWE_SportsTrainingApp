// Login - user not already created
// Create a mock for the user model to simulate database interactions
vi.mock('../../backend/models/User.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

import express from 'express';
import request from 'supertest';
import User from '../../backend/models/User.js';
import authRouter from '../../backend/routes/userRoutes.js';

// Create a min express app and use the auth router for testing
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Login - user does not exist', () => {
  it('returns "User doesn\'t exist" when username is not found', async () => {
    User.findOne.mockResolvedValue(null); // simulate no user in DB

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'ghost', password: 'anything' });

    expect(res.body.message).toBe("User doesn't exist");
  });
});
