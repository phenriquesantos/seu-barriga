module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  }

  const create = async (user) => {
    if (!user.name) return { error: 'name é um atributo obrigatório' }
    if (!user.email) return { error: 'email é um atributo obrigatório' };
    if (!user.password) return { error: 'password é um atributo obrigatório' };

    const checkUser = await findAll({ email: user.email })
    if (checkUser && checkUser.length) return { error: 'email já cadastrado' };

    return app.db('users').insert(user, '*');
  }

  return { findAll, create }

};
