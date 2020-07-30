const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Verify = require('../models/verify');

exports.verifyDataPoint = () => {
  const currentMinute = DateTime.local().setZone('Europe/Stockholm');
  console.log(`Verify data point : ${currentMinute.toISODate()} - ${currentMinute.toISOTime()}`);
  mongoose.connection.collection('Portfolio').findOne({})
    .then((err, doc) => {
      if (err) throw err;
      const { currentIntraday } = doc;
      mongoose.connection.collection('Intraday').findOne({ _id: currentIntraday._id })
        .populate('capital')
        .then((err2, intraday) => {
          if (err2) throw err2;
          if (!DateTime.fromISO(intraday.capital[intraday.capital.length - 1].date).hasSame(currentMinute, 'minute')) {
            Verify.findOne({}, (err3, verify) => {
              if (err3) throw err3;
              console.log('Data point missed.');
              verify.currentDay.missedDataPoints += 1;
              verify.save();
            });
          } else {
            console.log('Data point verified.');
          }
        });
    });
};

exports.verifyEndDay = () => {
  this.verifyDataPoint();
  mongoose.connection.collection('Portfolio').findOne({})
    .then((err, doc) => {
      if (err) throw err;
      const { currentIntraday } = doc;
      mongoose.connection.collection('Intraday').findOne({ _id: currentIntraday._id })
        .then((err2, intraday) => {
          if (err2) throw err2;
          const hasClose = intraday.close >= 0;
          const hasOpen = intraday.open >= 0;
          Verify.findOne({}, (err3, verify) => {
            if (err3) throw err3;
            console.log('Close and open verifed');
            verify.currentDay.openSet = hasOpen;
            verify.currentDay.closeSet = hasClose;
            verify.save();
          });
        });
    });
};

exports.init = () => {
  const newVerify = new Verify();
  newVerify.days = [];
  newVerify.save();
};

exports.verifyExist = () => new Promise((resolve, reject) => {
  Verify.find({}, (err, docs) => {
    if (err) reject(err);
    resolve(docs.length === 1);
  });
});

function isSameDay(d1, d2) {
  return d1.hasSame(d2, 'day');
}

function isNewTradingDay(d1, d2) {
  return !isSameDay(d1, d2)
      && d1.weekday > 0 && d1.weekday < 6;
}

exports.checkOrInitNewDay = () => {
  const currentDate = DateTime.local().setZone('Europe/Stockholm');
  Verify.findOne({}, (err, verify) => {
    if (err) throw err;
    if (verify.currentDay === undefined
    || isNewTradingDay(currentDate, DateTime.fromISO(verify.currentDay.date))) {
      console.log('New tradingday');
      if (verify.currentDay !== undefined) verify.days.push(verify.currentDay);
      verify.currentDay.date = currentDate.toISO();
      verify.currentDay.openSet = false;
      verify.currentDay.closeSet = false;
      verify.currentDay.missedDataPoints = 0;
      verify.save();
    }
  });
};
