'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => console.log(results))
//   .then(() => mongoose.disconnect())
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const id = '111111111111111111111105';
//     return Note.findById(id);
//   })
//   .then(results => console.log(results))
//   .then(() => mongoose.disconnect())
//   .catch(err => {
//     console.error(`Error ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {

//     const newNote = {
//       title: 'Wow a new title',
//       content: 'Wow new content'
//     }

//     return Note.create(newNote)
//   })
//   .then(results => console.log(results))
//   .then(() => mongoose.disconnect())
//   .catch(err => {
//     console.error(`Error ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const id = '5c350c86e44f4a26320b9354';
//     const updateObj = {
//       title: 'Updated title',
//       content: 'Updated content'
//     }


//     return Note.findByIdAndUpdate(id, updateObj)
//   })
//   .then(results => console.log(results))
//   .then(() => mongoose.disconnect())
//   .catch(err => console.error(`ERROR: ${err.message}`))

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
//   .then(() => {
//     const id = '5c350c86e44f4a26320b9354';

//     return Note.findByIdAndRemove(id);
//   })
//   .then(results => console.log(results))
//   .then(() => mongoose.disconnect())
//   .catch(err => console.error(`ERROR: ${err.message}`));

