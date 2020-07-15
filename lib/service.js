const cron = require('node-cron');
const { DateTime } = require('luxon');

const Portfolio = require('./api/portfolioController');
const Intraday = require('./api/intradayController');
const Capital = require('./api/capitalController');

let currentIntradayId;

exports.start = (avanza) => {
  Portfolio.getCurrentIntradayId()
    .then((id) => {
      currentIntradayId = id;
    })
    .catch((err) => {
      throw err;
    });

  function newCapital() {
    avanza.getTotalCapital()
      .then((capital) => Capital.newCapital(capital, currentIntradayId))
      .catch((err) => {
        throw err;
      });
  }
  // INTRADAY
  cron.schedule('5 * 9-16 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`INTRA DAY: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newCapital();
  }, {
    timezone: 'Europe/Stockholm',
  });

  // ENDING HOUR
  cron.schedule('5 0-30 17 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`ENDING HOUR: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newCapital();
  }, {
    timezone: 'Europe/Stockholm',
  });

  // LAST UPDATE
  cron.schedule('5 0 22 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`LAST UPDATE: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newCapital();
  }, {
    timezone: 'Europe/Stockholm',
  });

  // INIT NEW INTRADAY
  cron.schedule('5 0 6 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    Intraday.init()
      .then((res) => {
        currentIntradayId = res;
      })
      .catch((err) => {
        throw err;
      });
    console.log(`INIT DAY: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
  }, {
    timezone: 'Europe/Stockholm',
  });
};
