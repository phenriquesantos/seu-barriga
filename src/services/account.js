const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {

  const create = async (account) => {
    if (!account.name) throw new ValidationError('name é um atributo obrigatório');
    return app.db('accounts').insert(account, '*');
  };

  const findAll = () => {
    return app.db('accounts').select();
  }

  const find = (filters = {}) => {
    return app.db('accounts').where(filters).first();

  }

  const remove = (id) => {
    return app.db('accounts').where({ id }).delete();
  }

  const updateById = async (id, account) => {
    if (!account.name) throw new ValidationError('name é um atributo obrigatório');
    return app.db('accounts').where({ id }).update(account, '*');
  }

  return { create, findAll, remove, updateById, find };

}