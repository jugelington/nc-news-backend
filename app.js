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

app.use('/*', (req, res) => {
  res.status(404).send({ msg: '404 page not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.status === 404) {
    return res.status(404).send({ msg: 'ID not found' });
  }
});

app.use((err, req, res, next) => {
  return res.status(500).send({ message: 'Unknown Error!' });
});
module.exports = app;
