const Capital = require('../models/capital');
const IntradayController = require('./intradayController');

exports.createAndAdd = (date, capital, intradayID) => {
  const newCapital = new Capital();
  newCapital.date = date.toISO();
  newCapital.capital = capital;

  newCapital.save((err, doc) => {
    if (err) throw err;
    IntradayController.update(doc, intradayID);
  });
};
