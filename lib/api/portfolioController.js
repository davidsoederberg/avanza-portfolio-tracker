const Portfolio = require('../models/portfolio');
const Capital = require('../models/capital');
const Intraday = require('../models/intraday');

exports.update = (intraday) => {
  Capital.deleteMany({}, (err, res) => {
    if (err) console.log(err);
    else console.log(`Deleted ${res.deletedCount} capital-documents`);
  });
  Portfolio.find({}, (err, docs) => {
    if (err) throw err;
    const portfolio = docs[0];
    Intraday.findById(portfolio.currentIntraday, (err2, currentIntraday) => {
      if (err2) throw err2;
      currentIntraday.capital = [];
      currentIntraday.save();
      portfolio.intraday.push(currentIntraday._id);
      portfolio.currentIntraday = intraday;
      portfolio.save();
    });
  });
};

exports.init = () => {
  const newPortfolio = new Portfolio();
  newPortfolio.intraday = [];
  newPortfolio.closeLow = -1;
  newPortfolio.closeHigh = -1;
  newPortfolio.save();
};

exports.close = (close) => {
  Portfolio.find({}, (err, docs) => {
    if (err) throw err;
    const portfolio = docs[0];
    if (portfolio.closeHigh === -1 || close > portfolio.closeHigh) portfolio.closeHigh = close;
    if (portfolio.closeLow === -1 || close < portfolio.closeLow) portfolio.closeLow = close;
    portfolio.save();
  });
};

exports.check = async () => Portfolio.find({}, async (err) => {
  if (err) throw err;
});

exports.getPortfolio = (req, res) => {
  Portfolio.find({}, (err, docs) => {
    if (err) throw err;
    const portfolio = docs[0];
    Portfolio.populate(portfolio, [{ path: 'currentIntraday', model: 'Intraday' }, { path: 'intraday', model: 'Intraday' }], (err, intradayLoad) => {
      Portfolio.populate(intradayLoad, [{ path: 'intraday.capital', model: 'Capital' }, { path: 'currentIntraday.capital', model: 'Capital' }], (err, capitalLoad) => {
        res.send(capitalLoad);
      });
    });
  });
};

exports.getCurrentIntraday = () => new Promise((resolve, reject) => {
  Portfolio.find({}, (err, docs) => {
    if (err) reject(err);
    const portfolio = docs[0];
    Portfolio.populate(portfolio, [{ path: 'currentIntraday', model: 'Intraday' }], (err, populated) => {
      resolve(populated.currentIntraday);
    });
  });
});
