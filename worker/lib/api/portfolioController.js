const { DateTime } = require('luxon');
const Portfolio = require('../models/portfolio');
const Capital = require('../models/capital');
const Intraday = require('../models/intraday');
const IntradayController = require('./intradayController');

exports.newIntraday = (intraday) => {
  Capital.deleteMany({}, (err, res) => {
    if (err) console.log(err);
    else console.log(`Deleted ${res.deletedCount} capital-documents`);
  });
  Portfolio.findOne({}, (err, portfolio) => {
    if (err) throw err;
    Intraday.findById(portfolio.currentIntraday, (err2, currentIntraday) => {
      if (err2) throw err2;
      if (currentIntraday !== null) {
        currentIntraday.capital = [];
        currentIntraday.save();
        portfolio.intraday.push(currentIntraday._id);
      }
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

exports.newClose = (close) => {
  Portfolio.find({}, (err, docs) => {
    if (err) throw err;
    const portfolio = docs[0];
    if (portfolio.closeHigh === -1 || close > portfolio.closeHigh) portfolio.closeHigh = close;
    if (portfolio.closeLow === -1 || close < portfolio.closeLow) portfolio.closeLow = close;
    portfolio.save();
  });
};

exports.portfolioExist = () => new Promise((resolve, reject) => {
  Portfolio.find({}, (err, docs) => {
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

exports.getCurrentIntradayId = () => new Promise((resolve, reject) => {
  const currentDate = DateTime.local().setZone('Europe/Stockholm');
  Portfolio.findOne({}, (err, portfolio) => {
    if (err) reject(err);
    Portfolio.populate(portfolio, [{ path: 'currentIntraday', model: 'Intraday' }], (err3, populated) => {
      if (err3) reject(err3);
      if (portfolio.currentIntraday === undefined
      || isNewTradingDay(currentDate, DateTime.fromISO(populated.currentIntraday.date))) {
        IntradayController.init()
          .then((doc) => {
            resolve(doc._id);
          })
          .catch((err2) => {
            reject(err2);
          });
      } else {
        resolve(populated.currentIntraday._id);
      }
    });
  });
});

// exports.getPortfolio = (req, res) => {
//   Portfolio.find({}, (err, docs) => {
//     if (err) throw err;
//     const portfolio = docs[0];
//     Portfolio.populate(portfolio,[{ path: 'currentIntraday', model: 'Intraday' },
// { path: 'intraday', model: 'Intraday' }], (err, intradayLoad) => {
//       Portfolio.populate(intradayLoad, [{ path: 'intraday.capital', model: 'Capital' },
// { path: 'currentIntraday.capital', model: 'Capital' }], (err, capitalLoad) => {
//         res.send(capitalLoad);
//       });
//     });
//   });
// };
