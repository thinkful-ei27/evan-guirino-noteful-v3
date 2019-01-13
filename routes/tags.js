const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Tag = require('../models/tag');

router.get('/', (req, res, next) => {
  Tag.find()
    .sort('name')
    .then(tags => res.json(tags))
    .then(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Id is not valid');
    err.status = 400;
    next(err);
  }

  Tag.findById(id)
    .then(tag => {
      if (tag) {
        res.json(tag);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  const newTag = { name };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    next(err);
  }
  Tag.create(newTag)
    .then(newTag => {
      res
        .location(`${req.originalUrl}/${newTag.id}`)
        .status(201)
        .json(newTag);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { name } = req.body;
  const updateTag = { name };

  if (!name) {
    const err = new Error('Missing name from request body');
    err.status = 400;
    next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Tag id is not valid');
    err.status = 400;
    next(err);
  }

  Tag.findByIdAndUpdate(id, updateTag, { new: true })
    .then(updatedTag => {
      if (updatedTag) {
        res.json(updatedTag);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndRemove(id)
    .then(() => res.sendStatus(204).end())
    .catch(err => next(err));
});
module.exports = router;
