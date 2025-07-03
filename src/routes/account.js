module.exports = (app) => {

  const create = (req, res, next) => {
    return app.services.account.create(req.body)
      .then((result) => {
        return res.status(201).json(result[0]);
      }).catch(error => next(error));
  };

  const findAll = (req, res, next) => {
    app.services.account.findAll()
      .then((result) => {
        return res.status(200).json(result);
      }).catch(error => next(error))
  };

  const findById = (req, res, next) => {
    const id = req.params.id;
    app.services.account.find({ id })
      .then((result) => {
        return res.status(200).json(result[0]);
      }).catch(error => next(error))
  }

  const removeById = (req, res, next) => {
    const id = req.params.id;
    app.services.account.remove(id)
      .then(() => res.status(204).send())
      .catch(error => next(error));
  }

  const updateById = (req, res, next) => {
    const { id } = req.params;
    app.services.account.updateById(id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(error => next(error));
  }

  return { create, findAll, findById, removeById, updateById };
};
