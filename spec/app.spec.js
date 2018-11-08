process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');
const { expect } = require('chai');

const { Article, Comment } = require('../models');
const { articles, comments, topics, users } = require('../seed/testData');
const {
  newValidArticle,
  newInvalidArticle,
  newValidComment,
  newInvalidComment
} = require('../seed/testData/testinputs');

describe('/api', () => {
  let articleDocs, topicDocs, commentDocs, userDocs;
  beforeEach(() => {
    return seedDB({ articles, comments, topics, users }).then(data => {
      topicDocs = data[0];
      userDocs = data[1];
      articleDocs = data[2];
      commentDocs = data[3];
      console.log('Seeded fresh database');
    });
  });

  after(() => {
    return mongoose.disconnect();
  });

  describe('/topics', () => {
    it('GET / returns all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.haveOwnProperty('title');
          expect(res.body[0]).to.haveOwnProperty('slug');
        });
    });
    it('GET /api/topics/:topic_slug/articles works for an existing topic slug', () => {
      return request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.haveOwnProperty('title');
          expect(res.body[0]).to.haveOwnProperty('created_by');
          expect(res.body[0]).to.haveOwnProperty('created_at');
          expect(res.body[0]).to.haveOwnProperty('body');
          expect(res.body[0]).to.haveOwnProperty('belongs_to');
          expect(res.body[0]).to.haveOwnProperty('votes');
        });
    });
    it('Get /api/topics/:topic_slug/articles handles non-existing topic slugs', () => {
      return request
        .get('/api/topics/stefano/articles')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('404 Not Found');
        });
    });
    it('POST /api/topics/:topic_slug/articles works when given a valid article', () => {
      return request
        .post('/api/topics/example_topic/articles')
        .send(newValidArticle)
        .expect(201)
        .then(res => {
          expect(res.body.newArticle).to.haveOwnProperty('title');
          expect(res.body.newArticle.title).to.equal('Example title');
          expect(res.body.newArticle).to.haveOwnProperty('body');
          expect(res.body.newArticle.body).to.equal('This is example text');
        });
    });
    it('POST /api/topics/:topic_slug/articles rejects invalid articles', () => {
      return request
        .post('/api/topics/example_topic/articles')
        .send(newInvalidArticle)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('400 Bad Request');
        });
    });
    describe('/articles', () => {
      it('GET /api/articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(4);
            expect(res.body.articles[0]).to.haveOwnProperty('title');
            expect(res.body.articles[0].title).to.equal(
              'Living in the shadow of a great man'
            );

            expect(res.body.articles[0]).to.haveOwnProperty('body');
            expect(res.body.articles[0].body).to.equal(
              'I find this existence challenging'
            );
            expect(res.body.articles[0].created_at).to.equal(
              '2016-08-18T12:07:52.389Z'
            );
            expect(res.body.articles[0].created_by).to.be.an('object');
            expect(res.body.articles[0].belongs_to).to.equal('mitch');
            expect(res.body.articles[0].votes).to.equal(0);
          });
      });
      it('GET /api/articles/:article_id can find an article that exists', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.title).to.equal(articleDocs[0].title);
          });
      });
      it('GET /api/articles/:article_id returns 400 when an invalid article id is requested', () => {
        return request.get(`/api/articles/thisisnotanarticleid`).expect(400);
      });
      it('GET /api/articles/:article_id returns 404 when an valid article id is requested but not found', () => {
        return request
          .get(`/api/articles/5bd3332e7277997cd63f1b34`)
          .expect(404);
      });
      it('GET /api/articles/:article_id/comments works for real id', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].body).to.equal(commentDocs[0].body); // Is this right? Should these 2 things always be equal?
          });
      });
      it('GET /api/articles/:article_id/comments rejects invalid ids', () => {
        return request
          .get(`/api/articles/thisIsClearlyNotAGenuineId/comments`)
          .expect(400);
      });
      it('GET /api/articles/:article_id/comments gives 404 for valid ids that are not found', () => {
        return request
          .get(`/api/articles/5bd2332e7277997dd63f1a28/comments`)
          .expect(404);
      });
      it('POST /api/articles/:article_id/comments works for a valid comment', () => {
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newValidComment)
          .expect(201)
          .then(res => {
            expect(res.body.newComment).to.haveOwnProperty('body');
            expect(res.body.newComment.body).to.equal('This is my new comment');
            expect(res.body.newComment).to.haveOwnProperty('_id');
          });
      });
      it('POST /api/articles/:article_id/comments rejects invalid comments', () => {
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newInvalidComment)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('400 Bad Request');
          });
      });
      it('POST /api/articles/:article_id/comments rejects comments with invalid article id', () => {
        return request
          .post(`/api/articles/notAnArticleId/comments`)
          .send(newValidComment)
          .expect(400);
      });
      it('POST /api/articles/:article_id/comments rejects comments with valid article id that is not found', () => {
        return request
          .post(`/api/articles/5bd2332e7277997dd63f1a28/comments`)
          .send(newValidComment)
          .expect(404);
      });
      it('PATCH /api/articles/:article_id works for upvotes', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'title',
              'votes'
            ]);
            Article.findById(`${articleDocs[0]._id}`).then(article => {
              expect(article.votes).to.equal(articleDocs[0].votes + 1);
            });
          });
      });
      it('PATCH /api/articles/:article_id works for downvotes', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'title',
              'votes'
            ]);
            Article.findById(`${articleDocs[0]._id}`).then(article => {
              expect(article.votes).to.equal(articleDocs[0].votes - 1);
            });
          });
      });
      it('PATCH /api/articles/:article_id rejects invalid queries', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=i_refuse_to_vote`)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'title',
              'votes'
            ]);
            Article.findById(`${articleDocs[0]._id}`).then(article => {
              expect(article.votes).to.equal(articleDocs[0].votes);
            });
          });
      });
      it('PATCH /api/articles/:article_id returns 400 for invalid article ids', () => {
        return request
          .patch(`/api/articles/thereIsNoSuchArticle?vote=up`)
          .expect(400);
      });
      it('PATCH /api/articles/:article_id returns 404 for valid but non-existant article ids', () => {
        return request
          .patch(`/api/articles/5bd2332e7277997dd63f1a28?vote=up`)
          .expect(404);
      });
    });

    describe('/comments', () => {
      it('PATCH /api/comments/:comment_id works for upvotes', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'votes'
            ]);
            Comment.findById(`${commentDocs[0]._id}`).then(comment => {
              expect(comment.votes).to.equal(8);
            });
          });
      });
      it('PATCH /api/comments/:comment_id works for downvotes', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'votes'
            ]);
            Comment.findById(`${commentDocs[0]._id}`).then(comment => {
              expect(comment.votes).to.equal(6);
            });
          });
      });
      it('PATCH /api/comments/:comment_id handles invalid queries', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=i_hate_democracy`)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.keys([
              '__v',
              '_id',
              'belongs_to',
              'body',
              'created_at',
              'created_by',
              'votes'
            ]);
          });
      });
      it('PATCH /api/comments/:comment_id returns 400 for invalid Ids', () => {
        return request
          .patch('/api/comments/thisisaninvalidid?vote=up')
          .expect(400);
      });
      it('PATCH /api/comments/:comment_id returns 404 for valid but non-existant Ids', () => {
        return request
          .patch('/api/comments/5bd2332e7277997dd63f1a28?vote=up')
          .expect(404);
      });
      it('DELETE /api/comments/:comment_id works for a comment that exists', () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(204)
          .then(res => {
            expect(res.body).to.eql({});
            Comment.find().then(comments => {
              expect(comments.length).to.equal(7);
            });
          });
      });
      it('DELETE /api/comments/:comment_id returns 400 for invalid ids', () => {
        return request.delete('/api/comments/iDoNotExist').expect(400);
      });
      it('DELETE /api/comments/:comment_id returns 404 for valid but non-existant ids', () => {
        return request
          .delete('/api/comments/5bd2332e7277997dd63f1a28')
          .expect(404);
      });
    });
  });
});
