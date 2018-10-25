const { Article, Topic } = require('../models');

exports.getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send(topics);
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .then(articles => {
      res.send(articles);
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