const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {

  const findAll = (userId) => {
    return app.db('accounts').where({ user_id: userId }).select();
  }

  const find = (filters = {}) => {
    return app.db('accounts').where(filters).first();

  }

  const create = async (account) => {
    if (!account.name) throw new ValidationError('name é um atributo obrigatório');

    const accDb = await find({ name: account.name, user_id: account.user_id });
    if (accDb) throw new ValidationError('já existe uma conta cadastrada com esse nome');

    return app.db('accounts').insert(account, '*');
  };

  const remove = (id) => {
    return app.db('accounts').where({ id }).delete();
  }

  const updateById = async (id, account) => {
    if (!account.name) throw new ValidationError('name é um atributo obrigatório');
    return app.db('accounts').where({ id }).update(account, '*');
  }

  return { create, findAll, remove, updateById, find };

}