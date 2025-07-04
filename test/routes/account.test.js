const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let user;

beforeAll(async () => {
  const userRes = await app.services.user.create({
    name: 'Monkey D. Luffy',
    email: `reidospiratas${Date.now()}@mail.com`,
    password: '123456'
  });
  user = userRes[0];
});

test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id, name: 'Conta do chapéu de palha' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Conta do chapéu de palha');
      expect(res.body).toHaveProperty('user_id', user.id);
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Não deve criar uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name é um atributo obrigatório');
    });
});

test('Não deve inserir conta com nome duplicado para o mesmo usuario', () => {

});

test('Deve listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'Conta do luffy #01', user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve listar apenas as conta do usuario', () => {

});

test('Deve retornar uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #02', user_id: user.id }, ['id']);

  return request(app).get(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Conta do luffy #02');
      expect(res.body).toHaveProperty('user_id', user.id);
      expect(res.body).toHaveProperty('id', accountRes[0].id);
    });
});

test('Não de retornar uma conta de outro usuario', () => {

});

test('Deve atualizar uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #03', user_id: user.id }, ['id']);

  return request(app).put(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .send({ name: 'Conta do update' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Conta do update');
    });
});

test('Não deve atualizar uma conta de outro usuario', () => {

});

test('Deve remover uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #03', user_id: user.id }, ['id']);
  return request(app).delete(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover uma conta de outro usuario', () => {

});
