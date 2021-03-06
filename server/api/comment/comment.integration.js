'use strict';

var app = require('../..');
import request from 'supertest';

var newComment;

describe('Comment API:', function() {
  describe('GET /api/comments', function() {
    var comments;

    beforeEach(function(done) {
      request(app)
        .get('/api/comments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(comments).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/comments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/comments')
        .send({
          name: 'New Comment',
          info: 'This is the brand new comment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newComment = res.body;
          done();
        });
    });

    it('should respond with the newly created comment', function() {
      expect(newComment.name).to.equal('New Comment');
      expect(newComment.info).to.equal('This is the brand new comment!!!');
    });
  });

  describe('GET /api/comments/:id', function() {
    var comment;

    beforeEach(function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comment = res.body;
          done();
        });
    });

    afterEach(function() {
      comment = {};
    });

    it('should respond with the requested comment', function() {
      expect(comment.name).to.equal('New Comment');
      expect(comment.info).to.equal('This is the brand new comment!!!');
    });
  });

  describe('PUT /api/comments/:id', function() {
    var updatedComment;

    beforeEach(function(done) {
      request(app)
        .put(`/api/comments/${newComment._id}`)
        .send({
          name: 'Updated Comment',
          info: 'This is the updated comment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedComment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedComment = {};
    });

    it('should respond with the original comment', function() {
      expect(updatedComment.name).to.equal('New Comment');
      expect(updatedComment.info).to.equal('This is the brand new comment!!!');
    });

    it('should respond with the updated comment on a subsequent GET', function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let comment = res.body;

          expect(comment.name).to.equal('Updated Comment');
          expect(comment.info).to.equal('This is the updated comment!!!');

          done();
        });
    });
  });

  describe('PATCH /api/comments/:id', function() {
    var patchedComment;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/comments/${newComment._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Comment' },
          { op: 'replace', path: '/info', value: 'This is the patched comment!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedComment = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedComment = {};
    });

    it('should respond with the patched comment', function() {
      expect(patchedComment.name).to.equal('Patched Comment');
      expect(patchedComment.info).to.equal('This is the patched comment!!!');
    });
  });

  describe('DELETE /api/comments/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when comment does not exist', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
