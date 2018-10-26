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
  Topic.find({ slug: topic_slug }) // I feel like this step shouldn't be necessary, I can probably refactor to get rid of it
    .then(topics => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404 });
      }
    })
    .then(() => {
      return Article.find({ belongs_to: topic_slug });
    })

    .then(articles => res.send(articles))
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
