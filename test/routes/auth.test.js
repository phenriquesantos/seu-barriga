const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/auth'

test('Deve criar um usuario via signup', () => {
  return request(app).post(`${MAIN_ROUTE}/signup`)
    .send({ name: 'Kaido das 100 feras', email: `kaido_${Date.now()}@gmail.com`, password: 'teste132456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Kaido das 100 feras')
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Deve receber um token ao logar', async () => {
  const email = `crocoboy${Date.now()}@mail.com`;
  await app.services.user.create({
    name: 'Crocodile',
    email,
    password: 'teste123'
  });

  const res = await request(app).post(`${MAIN_ROUTE}/signin`)
    .send({ email, password: 'teste123' });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

test('Não deve autenticar usuario com senha errada', async () => {
  const email = `ivankov${Date.now()}@mail.com`;
  await app.services.user.create({
    name: 'Ivankov',
    email,
    password: 'teste123'
  });

  const res = await request(app).post(`${MAIN_ROUTE}/signin`)
    .send({ email, password: '123teste' });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error', 'Email ou senha invalido');
});

test('Não deve autenticar usuario que não existe', async () => {
  const res = await request(app).post(`${MAIN_ROUTE}/signin`)
    .send({ email: 'teste@mail.com', password: '123teste' });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error', 'Email ou senha invalido');
});

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    })
});