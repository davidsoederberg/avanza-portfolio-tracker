const { CronJob } = require('cron');
const vC = require('./api/verifyController');

// Verify
// - Capital each minute
// - Open
// - High

exports.start = () => {
  vC.checkOrInitNewDay();

  // INTRADAY
  new CronJob('30 * 9-16 * * 1-5', () => vC.verifyDataPoint(), null, true, 'Europe/Stockholm');
  // ENDING HOUR
  new CronJob('30 0-30 17 * * 1-5', () => vC.verifyDataPoint(), null, true, 'Europe/Stockholm');
  // LAST UPDATE
  new CronJob('30 0 22 * * 1-5', () => vC., null, true, 'Europe/Stockholm');
  // INIT NEW INTRADAY
  new CronJob('30 0 6 * * 1-5', () => vC.checkOrInitNewDay(), null, true, 'Europe/Stockholm');
};
