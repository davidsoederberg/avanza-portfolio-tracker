const mongoose = require('mongoose');

const { Schema } = mongoose;

const portfolio = new Schema({
  intraday: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Intraday',
  }],
  closeLow: Number,
  closeHigh: Number,
  currentIntraday: {
    type: mongoose.Schema.ObjectId,
    ref: 'Intraday',
  },
});

module.exports = mongoose.model('Portfolio', portfolio);
