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

  function newEntry(date) {
    avanza.getTotalCapital()
      .then((capital) => {
        Capital.createAndAdd(date, capital, currentIntradayId);
        if (date.hour === 9 && date.minute === 0) {
          Intraday.setOpen(capital, currentIntradayId);
        }
        if (date.hour === 22) Intraday.setClose(capital, currentIntradayId);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // INTRA DAY
  // 5 * 9-16 * * 1-5
  cron.schedule('5 * 9-16 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`INTRA DAY: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // ENDING HOUR
  // 5 0-31 17 * * 1-5
  cron.schedule('5 0-30 17 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`ENDING HOUR: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // LAST UPDATE
  // 5 0 22 * * 1-5
  cron.schedule('5 0 22 * * 1-5', () => {
    const currentDate = DateTime.local().setZone('Europe/Stockholm');
    console.log(`LAST UPDATE: ${currentDate.toISODate()} - ${currentDate.toISOTime()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // Init day
  // 0 0 6 * * 1-5
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
