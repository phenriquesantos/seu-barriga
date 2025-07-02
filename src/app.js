const app = require('express')();
const consign = require('consign');

consign({ cwd: 'src', verbose: false })
  .include('./config/middleware.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'João da Silva' },
  ];

  res.status(200).json(users);
})

app.post('/users', (req, res) => {
  res.status(201).json(req.body);
});

module.exports = app;
