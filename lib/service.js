const cron = require('node-cron');
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
        // 8 so it works with heroku
        if (date.getHours() === 8 && date.getMinutes() === 0) {
          Intraday.setOpen(capital, currentIntradayId);
        }
        // 19 so it works with heroku
        if (date.getHours() === 19) Intraday.setClose(capital, currentIntradayId);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // INTRA DAY
  // 5 * 9-16 * * 1-5
  cron.schedule('5 * 9-16 * * 1-5', () => {
    const currentDate = new Date();
    console.log(`INTRA DAY: ${currentDate.toDateString()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // ENDING HOUR
  // 5 0-31 17 * * 1-5
  cron.schedule('5 0-30 17 * * 1-5', () => {
    const currentDate = new Date();
    console.log(`ENDING HOUR: ${currentDate.toDateString()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // LAST UPDATE
  // 5 1 20 * * 1-5
  cron.schedule('5 0 20 * * 1-5', () => {
    const currentDate = new Date();
    console.log(`LAST UPDATE: ${currentDate.toDateString()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
    newEntry(currentDate);
  }, {
    timezone: 'Europe/Stockholm',
  });

  // Init day
  // 0 0 6 * * 1-5
  cron.schedule('5 0 6 * * 1-5', () => {
    const currentDate = new Date();
    Intraday.init(new Date())
      .then((res) => {
        currentIntradayId = res;
      })
      .catch((err) => {
        throw err;
      });
    console.log(`INIT DAY: ${currentDate.toDateString()} - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
  }, {
    timezone: 'Europe/Stockholm',
  });
};
