const { Article, Topic } = require('../models');
const { countComments } = require('../utils');

exports.getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send(topics);
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;

  Article.find({ belongs_to: topic_slug })
    .lean()
    .populate('created_by')
    .then(articles => {
      return articles.length === 0
        ? Promise.reject({ status: 404 })
        : Promise.all(articles.map(article => countComments(article))).then(
            formatted => res.send({ articles: [...formatted] })
          );
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = new Article(req.body);
  newArticle
    .save()
    .then(() => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};
