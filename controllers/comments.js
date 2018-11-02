const { Comment } = require('../models');

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  Comment.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: vote === 'up' ? 1 : vote === 'down' ? -1 : 0 } },
    { new: true }
  )
    .then(comment => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
