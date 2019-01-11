const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name : {type: String, required: true, unique: true}
})

tagSchema.set('timestamps', true);

tagSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
})

module.exports = mongoose.model('Tag', tagSchema);