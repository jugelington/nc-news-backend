const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = require('../config');
const { articles, comments, topics, users } = require('./devData');

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return seedDB({ articles, comments, topics, users });
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(console.log);
