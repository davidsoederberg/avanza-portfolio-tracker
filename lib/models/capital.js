const mongoose = require('mongoose');

const { Schema } = mongoose;

const capital = new Schema({
  date: Date,
  capital: Number,
});

module.exports = mongoose.model('Capital', capital);
