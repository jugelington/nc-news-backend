const usersRouter = require('express')();

const {
  getUserByUsername,
  getArticlesByUserId,
  getCommentsByUserId
} = require('../controllers/users');

usersRouter.get('/:username', getUserByUsername);
usersRouter.get('/:userId/articles', getArticlesByUserId);
usersRouter.get('/:userId/comments', getCommentsByUserId);

module.exports = { usersRouter };
