const apiRouter = require('express')();

const { getEndpointDocs } = require('../controllers/api');
const { topicsRouter } = require('../routers/topics');

apiRouter.get('/', getEndpointDocs);
apiRouter.use('/topics', topicsRouter);

module.exports = { apiRouter };
