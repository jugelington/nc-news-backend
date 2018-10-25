process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');
const { expect } = require('chai');

const { Article, Comment, Topic, User } = require('../models');

const articles = require('../seed/testData/articles.json');
const comments = require('../seed/testData/comments.json');
const topics = require('../seed/testData/topics.json');
const users = require('../seed/testData/users.json');

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
    it('GET /api/topics/:topic_slug/articles', () => {
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
    it('POST /api/topics/:topic_slug/articles', () => {
      const newArticle = {
        title: 'Example title',
        body: 'This is example text',
        created_by: '5bd080de8bbc631964814e2f',
        belongs_to: 'examples'
      };
      return request
        .post('/api/topics/example_topic/articles')
        .send(newArticle)
        .expect(201)
        .then(res => {
          expect(res.body.newArticle).to.haveOwnProperty('title');
          expect(res.body.newArticle.title).to.equal('Example title');
          expect(res.body.newArticle).to.haveOwnProperty('body');
          expect(res.body.newArticle.body).to.equal('This is example text');
        });
    });
    describe('/articles', () => {
      it('GET /api/articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.length).to.equal(4);
            expect(res.body[0]).to.haveOwnProperty('title');
            expect(res.body[0].title).to.equal(
              'Living in the shadow of a great man'
            );

            expect(res.body[0]).to.haveOwnProperty('body');
            expect(res.body[0].body).to.equal(
              'I find this existence challenging'
            );
            expect(res.body[0]).to.haveOwnProperty('created_at');
            expect(res.body[0].created_at).to.equal('2016-08-18T12:07:52.389Z');
            expect(res.body[0]).to.haveOwnProperty('created_by');
            expect(res.body[0].created_by).to.be.an('object');
            expect(res.body[0]).to.haveOwnProperty('belongs_to');
            expect(res.body[0].belongs_to).to.equal('mitch');
            expect(res.body[0]).to.haveOwnProperty('votes');
            expect(res.body[0].votes).to.equal(0);
          });
      });
      it('GET /api/articles/:article_id', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.haveOwnProperty('title');
            expect(res.body.title).to.equal(
              'Living in the shadow of a great man'
            );
          });
      });
      it('GET /api/articles/:article_id/comments', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].body).to.equal(
              'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.'
            );
          });
      });
      it('POST /api/articles/:article_id/comments', () => {
        const newComment = {
          body: 'This is my new comment',
          created_by: '5bd080de8bbc631964814e2a'
        };

        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(201)
          .then(res => {
            expect(res.body.newComment).to.haveOwnProperty('body');
            expect(res.body.newComment.body).to.equal('This is my new comment');
            expect(res.body.newComment).to.haveOwnProperty('_id');
          });
      });
      it('PATCH /api/articles/:article_id works for upvotes', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.haveOwnProperty('msg');
            expect(res.body.msg).to.equal('Upvote!');
            Article.findById(`${articleDocs[0]._id}`).then(article => {
              expect(article.votes).to.equal(1);
            });
          });
      });
      it('PATCH /api/articles/:article_id works for downvotes', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body).to.haveOwnProperty('msg');
            expect(res.body.msg).to.equal('Downvote!');
            Article.findById(`${articleDocs[0]._id}`).then(article => {
              expect(article.votes).to.equal(-1);
            });
          });
      });
      it('PATCH /api/articles/:article_id rejects invalid inputs', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=i_refuse_to_vote`)
          .expect(400);
      });
    });

    describe('/comments', () => {
      it('PATCH /api/comments/:comment_id works for upvotes', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.haveOwnProperty('msg');
            expect(res.body.msg).to.equal('Upvote!');
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
            expect(res.body).to.haveOwnProperty('msg');
            expect(res.body.msg).to.equal('Downvote!');
            Comment.findById(`${commentDocs[0]._id}`).then(comment => {
              expect(comment.votes).to.equal(6);
            });
          });
      });
      it('PATCH /api/comments/:comment_id rejects invalid inputs', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=i_hate_democracy`)
          .expect(400)
          .then(res => {
            expect(res.body).to.haveOwnProperty('msg');
            expect(res.body.msg).to.equal('Votes must be "up" or "down"!');
          });
      });
      it('DELETE /api/comments/:comment_id', () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.msg).to.equal('comment deleted!');
            Comment.find().then(comments => {
              expect(comments.length).to.equal(7);
            });
          });
      });
    });
  });

  after(() => {
    return mongoose.disconnect();
  });
});
