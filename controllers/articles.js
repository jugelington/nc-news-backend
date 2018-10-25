const { Article, Comment } = require('../models');
const { formatComment } = require('../utils');

exports.getAllArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const formattedComment = formatComment(req.body, article_id);
  const newComment = new Comment(formattedComment);
  newComment
    .save()
    .then(() => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  if (vote === 'up') {
    Article.findByIdAndUpdate(article_id, { $inc: { votes: 1 } }).then(() => {
      res.send({
        msg: 'Upvote!'
      });
    });
  } else if (vote === 'down') {
    Article.findByIdAndUpdate(article_id, { $inc: { votes: -1 } }).then(() => {
      res.send({
        msg: 'Downvote!'
      });
    });
  } else {
    res.send({ msg: 'Votes must be "up" or "down"!' });
  }
};
