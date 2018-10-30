const { Comment } = require('../models');

exports.generateRefs = (rawData, docs) => {
  return rawData.reduce((acc, data, i) => {
    if (data.title) {
      acc[data.title] = docs[i]._id;
    } else if (data.username) {
      acc[data.username] = docs[i]._id;
    }
    return acc;
  }, {});
};

exports.formatArticles = ({ articles, userRefs, topics, slugRefs }) => {
  return articles.map(article => ({
    ...article,
    created_by: userRefs[article.created_by],
    belongs_to: article.topic
  }));
};

exports.formatComments = ({ comments, userRefs, articleRefs }) => {
  return comments.map(comment => ({
    ...comment,
    created_by: userRefs[comment.created_by],
    belongs_to: articleRefs[comment.belongs_to]
  }));
};

exports.formatComment = (body, article_id) => {
  const postedAt = new Date();
  body.belongs_to = article_id;
  body.votes = 0;
  body.created_at = postedAt.toISOString();
  return body;
};

exports.countComments = article => {
  return Comment.countDocuments({ belongs_to: article._id }).then(
    comment_count => {
      article.comment_count = comment_count;
      return article;
    }
  );
};
