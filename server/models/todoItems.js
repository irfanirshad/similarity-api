const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  passwordStrength: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('todo1', TodoItemSchema);