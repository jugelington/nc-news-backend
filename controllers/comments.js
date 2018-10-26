const { Comment } = require('../models');

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  if (vote === 'up') {
    Comment.findOneAndUpdate({ _id: comment_id }, { $inc: { votes: 1 } })
      .then(() => {
        res.status(201).send({
          msg: 'Upvote!'
        });
      })
      .catch(next);
  } else if (vote === 'down') {
    Comment.findOneAndUpdate({ _id: comment_id }, { $inc: { votes: -1 } })
      .then(() => {
        res.status(201).send({
          msg: 'Downvote!'
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
