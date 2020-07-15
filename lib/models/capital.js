const mongoose = require('mongoose');

const { Schema } = mongoose;

const capital = new Schema({
  date: String,
  capital: Number,
});

module.exports = mongoose.model('Capital', capital);
