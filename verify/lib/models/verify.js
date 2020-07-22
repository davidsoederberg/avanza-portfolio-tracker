const mongoose = require('mongoose');

const { Schema } = mongoose;

const verify = new Schema({
  days: [],
  currentDay: {
    date: String,
    openSet: Boolean,
    closeSet: Boolean,
    missedDataPoints: Number,
  },
});

module.exports = mongoose.model('Verify', verify);
