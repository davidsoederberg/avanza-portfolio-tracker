if (process.env === 'test') require('dotenv').config();

const mongoose = require('mongoose');
const avanza = require('./lib/avanza');
const service = require('./lib/service');
const pC = require('./lib/api/portfolioController');

const credentials = {
  username: process.env.AVANZA_USERNAME,
  password: process.env.AVANZA_PASSWORD,
  totpSecret: process.env.AVANZA_TOTP_SECRET,
};

const DB_URL = 'mongodb://mongo:27017';

mongoose.connect(DB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true, dbName: process.env.DB_NAME })
  .then(() => {
    console.log('Database connection established...');
    avanza.authenticate(credentials)
      .then(() => {
        console.log('Authenticated to Avanza...');
        let waitTime = 0;
        pC.portfolioExist()
          .then((res) => {
            if (!res) {
              waitTime = 3000;
              console.log('Init portfolio...');
              pC.init();
            }
            console.log('Service starting...');
            setTimeout(() => { service.start(avanza); }, waitTime);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
