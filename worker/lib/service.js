const CronJob = require('cron').CronJob;
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

  function newCapital(typeOfJob) {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`${typeOfJob} : ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    avanza.getTotalCapital()
      .then((capital) => Capital.newCapital(capital, currentIntradayId))
      .catch((err) => {
        throw err;
      });
  }

  function initIntraday() {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`INIT DAY: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    Intraday.init()
      .then((res) => {
        currentIntradayId = res;
      })
      .catch((err) => {
        throw err;
      });
  }
  // INTRADAY
  new CronJob('5 * 9-16 * * 1-5', () => newCapital('INTRADAY'), null, true, 'Europe/Stockholm');
  // ENDING HOUR
  new CronJob('5 0-30 17 * * 1-5', () => newCapital('ENDING HOUR'), null, true, 'Europe/Stockholm');
  // LAST UPDATE
  new CronJob('5 0 22 * * 1-5', () => newCapital('LAST UPDATE'), null, true, 'Europe/Stockholm');
  // INIT NEW INTRADAY
  new CronJob('5 0 6 * * 1-5', () => initIntraday(), null, true, 'Europe/Stockholm');
};
