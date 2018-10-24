const seedDB = require('./seed');
const mongoose = require('mongoose');
const { DB_URL } = require('../config');
const articles = require('./testData/articles.json');
const comments = require('./testData/comments.json');
const topics = require('./testData/topics.json');
const users = require('./testData/users.json');

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
