const mongoose = require('mongoose');

const { Schema } = mongoose;

const intraday = new Schema({
  date: String,
  capital: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Capital',
  }],
  open: Number,
  close: Number,
  dayHigh: Number,
  dayLow: Number,
});

module.exports = mongoose.model('Intraday', intraday);
