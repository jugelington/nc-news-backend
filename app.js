const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const DB_URL = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : require('./config');

const { apiRouter } = require('./routers/api.js');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`Connected to ${DB_URL}`);
  })
  .catch(err => {
    console.log(err)
  });

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ msg: '404 page not found' });
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).send({ msg: '404 Not Found' });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (
    err.status === 400 ||
    err.name === 'CastError' ||
    err.name === 'ValidationError'
  ) {
    return res.status(400).send({ msg: '400 Bad Request' });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ message: 'Unknown Error!' });
});
module.exports = app;
