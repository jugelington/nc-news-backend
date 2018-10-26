const { Article, Comment } = require('../models');
const { formatComment, countComments } = require('../utils');

exports.getAllArticles = (req, res, next) => {
  Article.find()
    .lean()
    .populate('created_by')
    .then(articles => {
      return Promise.all(articles.map(article => countComments(article))).then(
        formatted => res.send(formatted)
      );
    })

    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate('created_by')
    .then(article => {
      if (!article) {
        return Promise.reject({ status: 404 });
      } else {
        return countComments(article);
      }
    })
    .then(article => {
      res.send(article);
    })
    .catch(next);
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .populate('created_by')
    .populate('belongs_to')
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

  if (vote === 'up' || vote === 'down') {
    Article.findOneAndUpdate(
      { _id: article_id },
      { $inc: { votes: vote === 'up' ? 1 : -1 } }
    )
      .then(article => {
        res.status(201).send({ msg: vote === 'up' ? 'Upvote!' : 'Downvote!' });
      })
      .catch(next);
  } else {
    next({ status: 400 });
  }
};
