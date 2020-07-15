const { DateTime } = require('luxon');
const Intraday = require('../models/intraday');
const PortfolioController = require('./portfolioController');

exports.update = (newCapital, id) => {
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.capital.push(newCapital._id);
    const { capital } = newCapital;
    if (capital > intraday.dayHigh) intraday.dayHigh = capital;
    if (intraday.dayLow === -1 || capital < intraday.dayLow) intraday.dayLow = capital;
    intraday.save();
  });
};

exports.setOpen = (open, id) => {
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.open = open;
    intraday.save();
  });
};

exports.setClose = (close, id) => {
  Intraday.findById(id, (err, intraday) => {
    if (err) throw err;
    intraday.close = close;
    intraday.save();
    PortfolioController.close(intraday.close);
  });
};

exports.init = () => new Promise((resolve, reject) => {
  const newIntraday = new Intraday();
  newIntraday.date = DateTime.local().toISO();
  newIntraday.capital = [];
  newIntraday.open = -1;
  newIntraday.close = -1;
  newIntraday.dayHigh = -1;
  newIntraday.dayLow = -1;

  newIntraday.save((err, doc) => {
    if (err) reject(err);
    PortfolioController.updateCurrentIntraday(doc._id);
    resolve(doc._id);
  });
});

exports.getOne = (req, res) => {
  Intraday.findById(req.params.id, (err, intraday) => {
    if (err) console.log(err);
    res.send(intraday);
  });
};
