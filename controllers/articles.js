const { Article, Comment } = require('../models');
const { formatComment } = require('../utils');

exports.getAllArticles = (req, res, next) => {
  Article.find()
    .lean()
    .populate('created_by')
    .then(articles => {
      return Promise.all(
        articles.map(article => {
          return Comment.countDocuments({
            belongs_to: article._id
          }).then(comment_count => {
            article.comment_count = comment_count;
            return article;
          });
        })
      ).then(formatted => res.send(formatted));
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
        return Promise.all([
          article,
          Comment.countDocuments({ belongs_to: article_id })
        ]);
      }
    })
    .then(([article, comment_count]) => {
      article._doc.comment_count = comment_count;
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
  if (vote === 'up') {
    Article.findByIdAndUpdate(article_id, { $inc: { votes: 1 } })
      .then(article => {
        res.status(201).send({
          msg: 'Upvote!'
        });
      })
      .catch(next);
  } else if (vote === 'down') {
    Article.findByIdAndUpdate(article_id, { $inc: { votes: -1 } })
      .then(article => {
        res.status(201).send({
          msg: 'Downvote!'
        });
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: 'Votes must be "up" or "down"!' });
  }
};
