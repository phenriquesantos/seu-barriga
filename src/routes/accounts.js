const express = require('express');

module.exports = (app) => {

  const router = express.Router();

  router.post('/', (req, res, next) => {
    return app.services.account.create(req.body)
      .then((result) => {
        return res.status(201).json(result[0]);
      }).catch(error => next(error));
  });


  router.get('/', (req, res, next) => {
    app.services.account.findAll()
      .then((result) => {
        return res.status(200).json(result);
      }).catch(error => next(error))
  });

  router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    app.services.account.find({ id })
      .then((result) => {
        return res.status(200).json(result);
      }).catch(error => next(error))
  });

  router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    app.services.account.updateById(id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(error => next(error));
  });

  router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    app.services.account.remove(id)
      .then(() => res.status(204).send())
      .catch(error => next(error));
  });

  return router;
};
