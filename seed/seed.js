const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const {
  generateRefs,
  formatArticles,
  generateSlugs,
  formatComments,
  generateArticleRefs
} = require('../utils');

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
      const formattedArticles = formatArticles({
        articles,
        userRefs,
        topics,
        slugRefs
      });
      return Promise.all([
        topicDocs,
        userDocs,
        Article.insertMany(formattedArticles),
        userRefs
      ]);
    })
    .then(([topicDocs, userDocs, articleDocs, userRefs]) => {
      // Formatting comments
      const articleRefs = generateRefs(articles, articleDocs);
      const formattedComments = formatComments({
        comments,
        userRefs,
        articleRefs
      });
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(formattedComments)
      ]);
    })

    .catch(console.log);
};

module.exports = seedDB;
