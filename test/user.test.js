const request = require('supertest');
const app = require('../src/app'); // Importa o app do servidor

test('Deve listar todos os usuarios', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('name', 'João da Silva');
    });
});

test('Deve inserir usuario com sucesso', () => {
  return request(app).post('/users')
    .send({ name: 'Maria da Silva', mail: 'maria@mail.com' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('mail', 'maria@mail.com')
      expect(res.body).toHaveProperty('name', 'Maria da Silva');
    });
});

