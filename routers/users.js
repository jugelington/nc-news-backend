const usersRouter = require('express')();

const { getUserByUsername } = require('../controllers/users');

usersRouter.get('/:username', getUserByUsername);

module.exports = { usersRouter };
