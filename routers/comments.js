const commentsRouter = require('express')();
const { patchCommentVotes, deleteComment } = require('../controllers/comments');

commentsRouter.patch('/:comment_id', patchCommentVotes);
commentsRouter.delete('/:comment_id', deleteComment);
module.exports = { commentsRouter };
