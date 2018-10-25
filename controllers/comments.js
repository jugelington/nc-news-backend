const { Comment } = require('../models');

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  if (vote === 'up') {
    Comment.findByIdAndUpdate(comment_id, { $inc: { votes: 1 } })
      .then(() => {
        res.send({
          msg: 'Upvote!'
        });
      })
      .catch(next);
  } else if (vote === 'down') {
    Comment.findByIdAndUpdate(comment_id, { $inc: { votes: -1 } })
      .then(() => {
        res.send({
          msg: 'Downvote!'
        });
      })
      .catch(next);
  } else {
    res.send({ msg: 'Votes must be "up" or "down"!' }).catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(() => {
      res.send({ msg: 'comment deleted!' });
    })
    .catch(next);
};
