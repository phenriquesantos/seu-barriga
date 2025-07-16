const express = require('express');
const ForbidenError = require('../errors/ForbidenError');

module.exports = (app) => {

  const router = express.Router();

  router.param('id', (req, res, next) => {
    const { id } = req.params;
    return app.services.account.find({ id })
      .then((account) => {
        if (account && account.user_id != req.user.id)
          throw new ForbidenError();

        next();
      });
  });

  router.post('/', (req, res, next) => {
    return app.services.account.create({ ...req.body, user_id: req.user.id })
      .then(result => res.status(201).json(result[0]))
      .catch(error => next(error));
  });


  router.get('/', (req, res, next) => {
    return app.services.account.findAll(req.user.id)
      .then((result) => res.status(200).json(result))
      .catch(error => next(error))
  });

  router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    return app.services.account.find({ id })
      .then((result) => res.status(200).json(result))
      .catch(error => next(error))
  });

  router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    return app.services.account.updateById(id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(error => next(error));
  });

  router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    return app.services.account.remove(id)
      .then(() => res.status(204).send())
      .catch(error => next(error));
  });

  return router;
};
