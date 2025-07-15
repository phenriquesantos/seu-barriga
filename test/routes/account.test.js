const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/v1/accounts';
const secret = 'segredo';
let user;
let user2;

beforeEach(async () => {
  // Criando primeiro usuario para testes
  const userRes = await app.services.user.create({
    name: 'Monkey D. Luffy',
    email: `reidospiratas${Date.now()}@mail.com`,
    password: '123456'
  });
  user = userRes[0];
  user.token = jwt.encode(user, secret);

  const userRes2 = await await app.services.user.create({
    name: 'Chopper',
    email: `dr.chopper${Date.now()}@mail.com`,
    password: 'algodãoDoce123'
  });
  user2 = userRes2[0];
});

test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Conta do chapéu de palha' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Conta do chapéu de palha');
      expect(res.body).toHaveProperty('user_id', user.id);
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Não deve criar uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({})
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name é um atributo obrigatório');
    });
});

test('Não deve inserir conta com nome duplicado para o mesmo usuario', () => {
  return app.db('accounts').insert({ name: 'Capitão Ussop', user_id: user.id })
    .then(() => request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Capitão Ussop' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('já existe uma conta cadastrada com esse nome');
      })
    );
});

test('Deve listar apenas as conta do usuario', () => {
  app.db('accounts').insert([
    { name: 'Nami', user_id: user.id },
    { name: 'Robin', user_id: user2.id }
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1)
    })
  );
});

test('Deve retornar uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #02', user_id: user.id }, ['id']);

  return request(app).get(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Conta do luffy #02');
      expect(res.body).toHaveProperty('user_id', user.id);
      expect(res.body).toHaveProperty('id', accountRes[0].id);
    });
});

test('Não de retornar uma conta de outro usuario', () => {
  return app.db('accounts').insert({ name: 'Jinbe', user_id: user2.id }, ['id'])
    .then((accRes) => request(app).get(`${MAIN_ROUTE}/${accRes[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence a este usuario');
      })
    );
});

test('Deve atualizar uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #03', user_id: user.id }, ['id']);

  return request(app).put(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Conta do update' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Conta do update');
    });
});

test('Não deve atualizar uma conta de outro usuario', () => {
  return app.db('accounts').insert({ name: 'Sanji', user_id: user2.id }, ['id'])
    .then((accRes) => request(app).put(`${MAIN_ROUTE}/${accRes[0].id}`)
      .send({ name: 'Sanji Vinsmoke' })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence a este usuario');
      })
    );
});

test('Deve remover uma conta por id', async () => {
  const accountRes = await app.db('accounts')
    .insert({ name: 'Conta do luffy #03', user_id: user.id }, ['id']);
  return request(app).delete(`${MAIN_ROUTE}/${accountRes[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover uma conta de outro usuario', () => {
  return app.db('accounts').insert({ name: 'Zoro Roronoa', user_id: user2.id }, ['id'])
    .then((accRes) => request(app).delete(`${MAIN_ROUTE}/${accRes[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Este recurso não pertence a este usuario');
      })
    );
});
