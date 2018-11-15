const usersRouter = require('express')();

const {
  getUserByUsername,
  getArticlesByUserId
} = require('../controllers/users');

usersRouter.get('/:username', getUserByUsername);
usersRouter.get('/:userId/comments', getArticlesByUserId);

module.exports = { usersRouter };
