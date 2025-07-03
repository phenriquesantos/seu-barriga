module.exports = (app) => {
  const findAll = (req, res, next) => {
    app.services.user.findAll()
      .then(result => res.status(200).send(result))
      .catch(error => next(error));
  };

  const create = (req, res, next) => {
    return app.services.user.create(req.body)
      .then((result) => {
        return res.status(201).json(result[0]);
      })
      .catch(error => next(error))
  };

  return { findAll, create };
};
