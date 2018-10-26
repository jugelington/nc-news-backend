exports.newValidArticle = {
  title: 'Example title',
  body: 'This is example text',
  created_by: '5bd080de8bbc631964814e2f',
  belongs_to: 'examples'
};

exports.newInvalidArticle = {
  title: 'Invalid Article',
  body: 'I am invalid because I do not have a belongs_to, or a created_by'
};

exports.newValidComment = {
  body: 'This is my new comment',
  created_by: '5bd080de8bbc631964814e2a'
};

exports.newInvalidComment = {
  created_by: 'Why am I sad? Because I have NO BODY'
};
