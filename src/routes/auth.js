const jwt = require('jwt-simple');
const bcript = require('bcrypt');
const ValidationError = require('../errors/ValidationError');

const secret = 'segredo';

module.exports = (app) => {

  const signin = (req, res, next) => {
    const { email, password } = req.body;
    app.services.user.findOne({ email })
      .then((user) => {
        if (!user) throw new ValidationError('Email ou senha invalido');;
        if (bcript.compareSync(password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else {
          throw new ValidationError('Email ou senha invalido');
        }
      }).catch(error => next(error));
  }

  return { signin };

};