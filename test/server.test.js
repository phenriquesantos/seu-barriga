const supertest = require('supertest');
const request = supertest('http://localhost:3000');

test('Deve responder na porta 3000', async () => {
  return request.get('/').then((response) => {
    expect(response.status).toBe(200);
  });
});