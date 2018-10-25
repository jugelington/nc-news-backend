const apiRouter = require('express')();

const { getEndpointDocs } = require('../controllers/api');

// Can these router requires be consolidated?
const { topicsRouter } = require('../routers/topics');
const { articlesRouter } = require('../routers/articles');
const { commentsRouter } = require('../routers/comments');
const { usersRouter } = require('../routers/users');

apiRouter.get('/', getEndpointDocs);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = { apiRouter };
