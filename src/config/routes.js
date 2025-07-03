module.exports = (app) => {
  app.route('/users')
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  app.route('/accounts')
    .get(app.routes.account.findAll)
    .post(app.routes.account.create)

  app.route('/accounts/:id')
    .get(app.routes.account.findById)
    .delete(app.routes.account.removeById)
    .put(app.routes.account.updateById)
}