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

describe('Signup - empty fields', () => {
  it('returns "Invalid email format" when email is empty', async () => {
    const res = await request(app)
      .post('/auth/signUP')
      .send({ username: 'testuser', email: '', password: 'password123' });

    expect(res.body.message).toBe('Invalid email format');
  });

  it('returns an error when username is empty', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/signUP')
      .send({ username: '', email: 'test@example.com', password: 'password123' });

    expect(res.body.error).toBeDefined();
  });

  it('returns an error when password is empty', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/signUP')
      .send({ username: 'testuser', email: 'test@example.com', password: '' });

    expect(res.body.error).toBeDefined();
  });
});

describe('Login - empty fields', () => {
  it('returns "User doesn\'t exist" when username is empty', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ username: '', password: 'anything' });

    expect(res.body.message).toBe("User doesn't exist");
  });

  it('returns "Password incorrect" when password is empty', async () => {
    User.findOne.mockResolvedValue({ username: 'testuser', password: 'correctpassword' });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: '' });

    expect(res.body.message).toBe('Password incorrect');
  });
});
