const usersRouter = require('express')();

const {
  getAllUsers,
  getUserByUsername,
  getArticlesByUserId,
  getCommentsByUserId
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getUserByUsername);
usersRouter.get('/:userId/articles', getArticlesByUserId);
usersRouter.get('/:userId/comments', getCommentsByUserId);

module.exports = { usersRouter };
