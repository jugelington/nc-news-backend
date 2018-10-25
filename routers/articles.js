const articlesRouter = require('express')();

const {
  getAllArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVotes
} = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getArticleComments);
articlesRouter.post('/:article_id/comments', postComment);
articlesRouter.patch('/:article_id', patchArticleVotes);

module.exports = { articlesRouter };
