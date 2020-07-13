if (process.env === 'test') require('dotenv').config();

const mongoose = require('mongoose');
const avanza = require('./lib/avanza');
const service = require('./lib/service');

const credentials = {
  username: process.env.AVANZA_USERNAME,
  password: process.env.AVANZA_PASSWORD,
  totpSecret: process.env.AVANZA_TOTP_SECRET,
};

const DB_URL = 'mongodb://mongo:27017/';

mongoose.connect(DB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true, dbName: process.env.DB_NAME })
  .then(() => {
    console.log('Database connection established...');
    avanza.authenticate(credentials)
      .then(() => {
        console.log('Authenticated to Avanza...');
        console.log('Service starting...');
        service.start(avanza);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
