const ValidationError = require('../errors/ValidationError');
const bcrypt = require('bcrypt');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'email']);
  };

  const findOne = (filters = {}) => {
    return app.db('users').where(filters).first();
  }

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  const create = async (user) => {
    if (!user.name) throw new ValidationError('name é um atributo obrigatório');
    if (!user.email) throw new ValidationError('email é um atributo obrigatório');
    if (!user.password) throw new ValidationError('password é um atributo obrigatório');

    const checkUser = await findOne({ email: user.email })
    if (checkUser) throw new ValidationError('email já cadastrado');
    const newUser = user;
    newUser.password = getPasswordHash(user.password);

    return app.db('users').insert(newUser, ['id', 'name', 'email']);
  };

  return { findAll, create, findOne }

};
