const mongoose = require('mongoose');
const { DB_URL } = require('./config');
const express = require('express');
const app = express();

const { apiRouter } = require('./routers/api.js');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`Connected to ${DB_URL}`);
  });

app.use('/api', apiRouter);

module.exports = app;
