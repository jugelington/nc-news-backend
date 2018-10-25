exports.getEndpointDocs = (req, res, next) => {
  const returnApiDocs = true;
  res.render('index', { returnApiDocs }).catch(next);
};
