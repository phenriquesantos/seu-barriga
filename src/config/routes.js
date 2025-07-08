module.exports = (app) => {
  app.route('/auth/signin')
    .post(app.routes.auth.signin);

  app.route('/auth/signup')
    .post(app.routes.users.create);

  app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app.route('/accounts')
    .all(app.config.passport.authenticate())
    .get(app.routes.account.findAll)
    .post(app.routes.account.create);

  app.route('/accounts/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.account.findById)
    .delete(app.routes.account.removeById)
    .put(app.routes.account.updateById);
}
