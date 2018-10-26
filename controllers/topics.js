const { Article, Topic } = require('../models');

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
    .then(articles => {
      return articles.length === 0
        ? Promise.reject({ status: 404 })
        : res.send(articles);
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
