const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/auth/signin'

test('Deve receber um token ao logar', async () => {
  const email = `crocoboy${Date.now()}@mail.com`;
  await app.services.user.create({
    name: 'Crocodile',
    email,
    password: 'teste123'
  });

  const res = await request(app).post(MAIN_ROUTE)
    .send({ email, password: 'teste123' });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});