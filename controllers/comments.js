const { Comment } = require('../models');

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  if (vote === 'up' || vote === 'down') {
    Comment.findOneAndUpdate(
      { _id: comment_id },
      { $inc: { votes: vote === 'up' ? 1 : -1 } }
    )
      .then(() => {
        res.status(201).send({
          msg: vote === 'up' ? 'Upvote!' : 'Downvote!'
        });
      })
      .catch(next);
  } else {
    res
      .status(400)
      .send({ msg: 'Votes must be "up" or "down"!' })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(() => {
      res.status(200).send({ msg: 'comment deleted!' });
    })
    .catch(next);
};
