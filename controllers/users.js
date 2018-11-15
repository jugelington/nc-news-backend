const { User, Article, Comment } = require('../models');

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => res.send(...user))
    .catch(next);
};

exports.getArticlesByUserId = (req, res, next) => {
  const { userId } = req.params;
  Article.find({ created_by: userId })
    .then(articles => {
      if (!articles) throw { status: 404 };
      res.send(articles);
    })
    .catch(next);
};

exports.getCommentsByUserId = (req, res, next) => {
  const { userId } = req.params;
  Comment.find({ created_by: userId })
    .populate('belongs_to')
    .then(comments => {
      if (!comments) throw { status: 404 };
      res.send(comments);
    })
    .catch(next);
};
