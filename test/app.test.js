const request = require('supertest');

const app = require('../src/app'); // Importa o app do servidor

test('Deve responder na raiz', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
