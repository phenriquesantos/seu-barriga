const request = require('supertest');
const app = require('../../src/app'); // Importa o app do servidor
const createEmail = `${Date.now()}@mail.com`;

test('Deve listar todos os usuarios', () => {
  const email = `${Date.now()}@mail.com`;
  return app.db('users').insert({ name: 'Jair Luis', email, password: '123456' })
    .then(() => request(app).get('/users'))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
})

test('Deve inserir usuario com sucesso', () => {
  return request(app).post('/users')
    .send({ name: 'Maria da Silva', email: createEmail, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', createEmail)
      expect(res.body).toHaveProperty('name', 'Maria da Silva');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Deve inserir a senha criptografada', async () => {
  const email = `${Date.now()}@mail.com`;
  const res = await request(app).post('/users')
    .send({ name: 'Luciano Mendonsa', email, password: '123456' });

  expect(res.status).toBe(201);
  const { id } = res.body;
  const user = await app.services.user.findOne({ id });
  expect(user.password).not.toBeUndefined();
  expect(user.password).not.toBe('123456');
});

test('Não deve inserir usuario sem nome', () => {
  return request(app).post('/users')
    .send({ email: 'teste@mail.com', password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name é um atributo obrigatório');
    });
});

test('Não deve inserir usuario sem email', async () => {
  const res = await request(app).post('/users')
    .send({ name: 'Mario Lopes', password: '123456' });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe('email é um atributo obrigatório');
});

test('Não deve inserir usuario sem senha', (done) => {
  request(app).post('/users')
    .send({ email: 'test@mail.com', name: 'Chicó' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('password é um atributo obrigatório');
      done();
    }).catch(err => done.fail(err));
});

test('Não deve inserir usuario com email existente', () => {
  return request(app).post('/users')
    .send({ email: createEmail, name: "Augostinho Carrara", password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('email já cadastrado')
    })
});