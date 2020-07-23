if (process.env === 'test') require('dotenv').config();

const mongoose = require('mongoose');
const service = require('./lib/service');
const vC = require('./lib/api/verifyController');

const DB_URL = 'mongodb://mongo:27017';
let waitTime = 0;

mongoose.connect(DB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true, dbName: process.env.DB_NAME })
  .then(() => {
    vC.verifyExist()
      .then((res) => {
        if (!res) {
          waitTime = 3000;
          console.log('Init verify...');
          vC.init();
        }
        console.log('Service starting...');
        setTimeout(() => { service.start(); }, waitTime);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
