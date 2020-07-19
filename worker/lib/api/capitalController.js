const { DateTime } = require('luxon');
const Capital = require('../models/capital');
const IntradayController = require('./intradayController');

exports.newCapital = (capital, intradayId) => {
  const date = DateTime.local().setZone('Europe/Stockholm');
  const newCapital = new Capital();
  newCapital.date = date;
  newCapital.capital = capital;

  newCapital.save((err, doc) => {
    if (err) throw err;
    IntradayController.updateNewCapital(doc, intradayId);
  });
  if (date.hour === 9 && date.minute === 0) IntradayController.setOpen(capital);
  if (date.hour === 22) IntradayController.setClose(capital);
};
