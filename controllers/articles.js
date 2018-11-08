const { Article, Comment } = require('../models');
const { formatComment, countComments, patchVotes } = require('../utils');

exports.getAllArticles = (req, res, next) => {
  Article.find()
    .lean()
    .populate('created_by')
    .then(articles => {
      return Promise.all(articles.map(article => countComments(article))).then(
        formatted => res.send({ articles: [...formatted] })
      );
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate('created_by')
    .then(article => {
      if (!article) throw { status: 404 };
      return countComments(article);
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
      if (comments.length === 0) throw { status: 404 };
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const formattedComment = formatComment(req.body, article_id);
  const newComment = new Comment(formattedComment);

  Article.find({ _id: article_id })
    .then(article => {
      if (article.length === 0) throw { status: 404 };
      newComment
        .save()
        .then(() => {
          res.status(201).send({ newComment });
        })
        .catch(next);
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  return patchVotes(Article, article_id, vote, res, next);
};
