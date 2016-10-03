'use strict';

var app = require('../..');
import request from 'supertest';

var newGuess;

describe('Guess API:', function() {
  describe('GET /api/guesss', function() {
    var guesss;

    beforeEach(function(done) {
      request(app)
        .get('/api/guesss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          guesss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(guesss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/guesss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/guesss')
        .send({
          name: 'New Guess',
          info: 'This is the brand new guess!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newGuess = res.body;
          done();
        });
    });

    it('should respond with the newly created guess', function() {
      expect(newGuess.name).to.equal('New Guess');
      expect(newGuess.info).to.equal('This is the brand new guess!!!');
    });
  });

  describe('GET /api/guesss/:id', function() {
    var guess;

    beforeEach(function(done) {
      request(app)
        .get(`/api/guesss/${newGuess._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          guess = res.body;
          done();
        });
    });

    afterEach(function() {
      guess = {};
    });

    it('should respond with the requested guess', function() {
      expect(guess.name).to.equal('New Guess');
      expect(guess.info).to.equal('This is the brand new guess!!!');
    });
  });

  describe('PUT /api/guesss/:id', function() {
    var updatedGuess;

    beforeEach(function(done) {
      request(app)
        .put(`/api/guesss/${newGuess._id}`)
        .send({
          name: 'Updated Guess',
          info: 'This is the updated guess!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedGuess = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGuess = {};
    });

    it('should respond with the original guess', function() {
      expect(updatedGuess.name).to.equal('New Guess');
      expect(updatedGuess.info).to.equal('This is the brand new guess!!!');
    });

    it('should respond with the updated guess on a subsequent GET', function(done) {
      request(app)
        .get(`/api/guesss/${newGuess._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let guess = res.body;

          expect(guess.name).to.equal('Updated Guess');
          expect(guess.info).to.equal('This is the updated guess!!!');

          done();
        });
    });
  });

  describe('PATCH /api/guesss/:id', function() {
    var patchedGuess;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/guesss/${newGuess._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Guess' },
          { op: 'replace', path: '/info', value: 'This is the patched guess!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedGuess = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedGuess = {};
    });

    it('should respond with the patched guess', function() {
      expect(patchedGuess.name).to.equal('Patched Guess');
      expect(patchedGuess.info).to.equal('This is the patched guess!!!');
    });
  });

  describe('DELETE /api/guesss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/guesss/${newGuess._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when guess does not exist', function(done) {
      request(app)
        .delete(`/api/guesss/${newGuess._id}`)
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
