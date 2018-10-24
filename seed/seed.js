const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { generateRefs, formatArticles, generateSlugs } = require('../utils');

const seedDB = ({ articles, comments, topics, users }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([Topic.insertMany(topics), User.insertMany(users)]);
    })
    .then(([topicDocs, userDocs]) => {
      // Formatting articles
      const userRefs = generateRefs(users, userDocs);
      const slugRefs = generateSlugs(topics);
      console.log(slugRefs);
      const formattedArticles = formatArticles({
        articles,
        userRefs,
        topics,
        slugRefs
      });
      console.log(formattedArticles);
    })
    .catch(console.log);
};

module.exports = seedDB;
