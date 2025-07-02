const app = require('express')();

app.get('/', (req, res) => {
  res.status(200).send();
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'João da Silva' },
  ];

  res.status(200).json(users);
})

module.exports = app;
