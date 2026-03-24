import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';


vi.mock('../../backend/models/User.js', () => {

  const mockFindOne = vi.fn();

  const MockUser = function(data) {
    this.username = data && data.username;
    this.email = data && data.email;
    this.password = data && data.password;
    this.save = vi.fn().mockResolvedValue(this);
};
  MockUser.findOne = mockFindOne;

  return {
    default: MockUser,
  };
});


import authRouter from '../../backend/routes/userRoutes.js';
import User from '../../backend/models/User.js';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const mockFindOne = User.findOne;

beforeEach(() => {
  mockFindOne.mockReset();
});



describe('Username Duplicate Tests', () => {
  it('rejects signup when username already exists', async () => {
    mockFindOne
    .mockResolvedValueOnce({
      username: 'ryan_test3',
      email: 'ryan@test.com',
    })
    .mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/signUP')
      .send({
        username: 'ryan_test',
        email: 'ryan10@test.com',
        password: 'password_test2'
      });
    expect(res.body.message).toBe('Username already exists');
  });
});

describe('Successful Signup Tests', () => {
  it('allows signup when username and email are unique', async () => {
    mockFindOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/signUP')
      .send({
        username: 'ryan_test2',
        email: 'ryan20@test.com',
        password: 'password_test'
      });
    expect(res.body.message).toBe('New user created');
  });
});


describe('Email Duplicate Tests', () => {
  it('rejects signup when email already exists', async () => {
    mockFindOne
      .mockResolvedValueOnce(null)     
      .mockResolvedValueOnce({        
        username: 'ryan_test67',
        email: 'ryan@test.com',
      });

    const res = await request(app)
      .post('/auth/signUP')
      .send({
        username: 'ryan_test89',
        email: 'ryan@test.com',
        password: 'password_test2'
      });
    expect(res.body.message).toBe('Email already exists');
  });
});


describe('Email Format Validation Tests', () => {
  it('rejects signup when email format is invalid', async () => {
    const invalidEmails = [
      'invalidemail',
      'invalid@',
      '@invalid.com',
      'invalid@com',
      'invalid@.com',
      'invalid email@breh.com',
      'invalid@@email.com',
    ];
    
    for (const email of invalidEmails) {
      const res = await request(app)
        .post('/auth/signUP')
        .send({
          username: 'testuser',
          email: email,
          password: 'password123'
        });
      
      expect(res.body.message).toBe('Invalid email format');
    }
  });
});