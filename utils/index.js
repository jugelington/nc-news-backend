exports.generateRefs = (rawData, docs) => {
  return rawData.reduce((acc, data, i) => {
    acc[data.username] = docs[i]._id;
    return acc;
  }, {});
};

exports.generateSlugs = topics => {
  return topics.reduce((acc, data) => {
    acc[data.slug] = data.title;
    return acc;
  }, {});
};

exports.generateArticleRefs = (articles, docs) => {
  return articles.reduce((acc, data, i) => {
    acc[data.title] = docs[i]._id;

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
