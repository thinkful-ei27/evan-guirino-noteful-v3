const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Folder = require('../models/folder');

router.get('/', (req, res, next) => {
  Folder.find()
    .sort('name')
    .then(folders => res.json(folders))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { name } = req.body;

  const newFolder = { name };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(newFolder => {
      if (newFolder) {
        res
          .location(`${req.originalUrl}/${newFolder.id}`)
          .status(201)
          .json(newFolder);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateFolder = { name };


  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }


  if (!name) {
    const err = new Error('No `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(id, updateFolder, { new: true })
    .then(folder => {
      if (folder) {
        res
          .location(`${req.originalUrl}/${folder.id}`)
          .status(201)
          .json(folder);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 1100) {
        err = new Error(`Name already exists ${err.message}`);
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  Folder.findByIdAndRemove(id)
    .then(() => res.sendStatus(204))
    .catch(err => console.err(`ERROR: ${err.message}`));
});

module.exports = router;
