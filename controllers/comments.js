const { Comment } = require('../models');
const { patchVotes } = require('../utils');

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  return patchVotes('Comment', comment_id, vote, res, next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(deletedComment => {
      if (!deletedComment) throw { status: 404 };
      res.status(204).send();
    })
    .catch(next);
};
