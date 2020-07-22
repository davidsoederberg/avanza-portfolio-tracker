if (process.env === 'test') require('dotenv').config();

const mongoose = require('mongoose');
const service = require('./lib/service');

const DB_URL = 'mongodb://mongo:27017';

mongoose.connect(DB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true, dbName: process.env.DB_NAME })
  .then(() => {
    service.start();
  })
  .catch((err) => {
    console.log(err);
  });
