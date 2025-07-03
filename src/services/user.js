const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };

  const create = async (user) => {
    if (!user.name) throw new ValidationError('name é um atributo obrigatório');
    if (!user.email) throw new ValidationError('email é um atributo obrigatório');
    if (!user.password) throw new ValidationError('password é um atributo obrigatório');

    const checkUser = await findAll({ email: user.email })
    if (checkUser && checkUser.length) throw new ValidationError('email já cadastrado');

    return app.db('users').insert(user, '*');
  };

  return { findAll, create }

};
