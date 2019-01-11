const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

folderSchema.set('timestamps', true);

folderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Folder', folderSchema);