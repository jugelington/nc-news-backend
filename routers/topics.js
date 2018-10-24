const topicsRouter = require('express')();

const {
  getAllTopics,
  getArticlesByTopic,
  postArticle
} = require('../controllers/topics');

topicsRouter.get('/', getAllTopics);
topicsRouter.get('/:topic_slug/articles', getArticlesByTopic);
topicsRouter.post('/:topic_slug/articles', postArticle);

module.exports = { topicsRouter };
