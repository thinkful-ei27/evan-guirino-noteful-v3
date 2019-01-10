'use strict';

const express = require('express');
const router = express.Router();

const Note = require('../models/note')

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  const { searchTerm } = req.query;
  let filter = {};
  if (searchTerm) {
    filter = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
      ]
    };
  }

  Note.find(filter).sort({ updatedAt: 'desc' })
    .then(notes => res.json(notes))
    .catch(err => console.error(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  const { id } = req.params;

  Note.findById(id)
    .then(note => res.json(note))
    .catch(err => console.err(err.message));

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const { title, content } = req.body;

  const newNote = {
    title,
    content
  };

  if (!newNote.title) {
    const err = new Error('Missing title in the request body');
    err.status = 400;
    return next(err);
  }

  Note.create(newNote)
    .then(newNote => {
      if (newNote) {
        res.location(`${req.originalUrl}`).status(201).json(newNote);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params

  const updatedNote = {};

  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    updatedNote[field] = req.body[field];
  })

  if (!updatedNote.title) {
    const err = new Error(`Missing title in the request`);
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndUpdate(id, updatedNote)
    .then(newNote => {
      if (newNote) {
        res.location(`${req.originalUrl}`).status(201).json(newNote);
        res.json(newNote);
      } else {
        next();
      }
    })
    .catch(err => next(err));



});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
    .then(() => res.sendStatus(204))
    .catch(err => console.err(`ERROR: ${err.message}`));
  
  
});

module.exports = router;
