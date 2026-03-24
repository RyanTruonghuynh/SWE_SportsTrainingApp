vi.mock('../../backend/models/User.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

import express from 'express';
import request from 'supertest';
import User from '../../backend/models/User.js';
import authRouter from '../../backend/routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Login - password mismatch', () => {
  it('returns "Password incorrect" when password does not match', async () => {
    User.findOne.mockResolvedValue({ username: 'testuser', password: 'correctpassword' });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(res.body.message).toBe("Password incorrect");
  });
});
