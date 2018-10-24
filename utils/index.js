exports.generateRefs = (rawData, docs) => {
  return rawData.reduce((acc, data, i) => {
    acc[data.username] = docs[i]._id;
    return acc;
  }, {});
};

exports.generateSlugs = topics => {
  return topics.reduce((acc, data, i) => {
    acc[data.slug] = data.title;
    return acc;
  }, {});
};

exports.formatArticles = ({ articles, userRefs, topics, slugRefs }) => {
  return articles.map(article => ({
    ...article,
    created_by: userRefs[article.created_by],
    belongs_to: slugRefs[article.topic]
  }));
};
