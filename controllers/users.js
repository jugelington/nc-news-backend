const { User, Article } = require('../models');

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => res.send(...user))
    .catch(next);
};

exports.getArticlesByUserId = (req, res, next) => {
  const { userId } = req.params;
  Article.find({ created_by: userId }).then(articles => {
    if (!articles) throw { status: 404 };
    res.send({ articles });
  });
};
