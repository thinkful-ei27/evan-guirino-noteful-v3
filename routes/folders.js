const express = require('express');
const router = express.Router();

const Folder = require('../models/folder');

router.get('/', (req, res, next) => {
  let filter = {};
  const { searchTerm } = req.query;
  if (searchTerm) {
    filter = {
      name: { $regex: searchTerm, options: 'i' }
    };
  }

  Folder.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(folders => res.json(folders))
    .catch(err => console.err(`ERROR: ${err.message}`));
});


router.get('/:id', (req, res, next) => {
  const id  = req.params.id;

  Folder.findById(id)
    .then(folder => res.json(folder))
    .catch(err => {
      console.err(`ERROR: ${err.message}`);
      return next(err);
    });
});

router.post('/', (req, res, next) => {
 
  const { name } = req.body;
 
  const newFolder = { name };

  if (!newFolder.name) {
    const err = new Error('Missing `name` in request bod')
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(newFolder => {
      if (newFolder) {
        res.location(req.originalUrl).status(201).json(newFolder);
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

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateFolder = { name };

  if (!updateFolder.name) {
    const err = new Error('No `name` in request body')
    err.status = 400;
    return next(err);
  }


  Folder.findByIdAndUpdate(id)
    .then(folder => {

      if (folder) {
        res.location(req.originalUrl).status(201).json(folder);
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

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Folder.findOneAndRemove(id)
    .then(() => res.status(204))
    .catch(err => console.err(`ERROR: ${err.message}`));
});

module.exports = router;