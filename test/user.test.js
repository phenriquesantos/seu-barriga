const request = require('supertest');
const app = require('../src/app'); // Importa o app do servidor

test('Devo listar todos os usuarios', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('name', 'João da Silva');
    });
});

