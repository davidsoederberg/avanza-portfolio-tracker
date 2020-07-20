const { DateTime } = require('luxon');
const Intraday = require('../models/intraday');
const PortfolioController = require('./portfolioController');

exports.updateNewCapital = (newCapital, id) => {
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.capital.push(newCapital._id);
    const { capital } = newCapital;
    if (capital > intraday.dayHigh) intraday.dayHigh = capital;
    if (intraday.dayLow === -1 || capital < intraday.dayLow) intraday.dayLow = capital;
    intraday.save();
  });
};

exports.setOpen = async (open) => {
  const id = await PortfolioController.getCurrentIntradayId();
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.open = open;
    intraday.save();
  });
};

exports.setClose = async (close) => {
  const id = await PortfolioController.getCurrentIntradayId();
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.close = close;
    intraday.save();
    PortfolioController.newClose(intraday.close);
  });
};

exports.init = () => new Promise((resolve, reject) => {
  const newIntraday = new Intraday();
  newIntraday.date = DateTime.local().setZone('Europe/Stockholm').toISO();
  newIntraday.capital = [];
  newIntraday.open = -1;
  newIntraday.close = -1;
  newIntraday.dayHigh = -1;
  newIntraday.dayLow = -1;

  newIntraday.save((err, doc) => {
    if (err) reject(err);
    PortfolioController.newIntraday(doc._id);
    resolve(doc._id);
  });
});
