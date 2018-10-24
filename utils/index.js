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
    created_by: article.created_by // There *must* be a more efficient way of doing this!
      .split(' ')
      .map(creator => userRefs[creator])
      .join(''),
    belongs_to: article.topic
      .split(' ')
      .map(topic => slugRefs[topic])
      .join('')
  }));
};
