'use strict';

var app = require('../..');
import request from 'supertest';

var newGame;

describe('Game API:', function() {
  describe('GET /api/games', function() {
    var games;

    beforeEach(function(done) {
      request(app)
        .get('/api/games')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          games = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(games).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/games', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/games')
        .send({
          name: 'New Game',
          info: 'This is the brand new game!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newGame = res.body;
          done();
        });
    });

    it('should respond with the newly created game', function() {
      expect(newGame.name).to.equal('New Game');
      expect(newGame.info).to.equal('This is the brand new game!!!');
    });
  });

  describe('GET /api/games/:id', function() {
    var game;

    beforeEach(function(done) {
      request(app)
        .get(`/api/games/${newGame._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          game = res.body;
          done();
        });
    });

    afterEach(function() {
      game = {};
    });

    it('should respond with the requested game', function() {
      expect(game.name).to.equal('New Game');
      expect(game.info).to.equal('This is the brand new game!!!');
    });
  });

  describe('PUT /api/games/:id', function() {
    var updatedGame;

    beforeEach(function(done) {
      request(app)
        .put(`/api/games/${newGame._id}`)
        .send({
          name: 'Updated Game',
          info: 'This is the updated game!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedGame = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGame = {};
    });

    it('should respond with the original game', function() {
      expect(updatedGame.name).to.equal('New Game');
      expect(updatedGame.info).to.equal('This is the brand new game!!!');
    });

    it('should respond with the updated game on a subsequent GET', function(done) {
      request(app)
        .get(`/api/games/${newGame._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let game = res.body;

          expect(game.name).to.equal('Updated Game');
          expect(game.info).to.equal('This is the updated game!!!');

          done();
        });
    });
  });

  describe('PATCH /api/games/:id', function() {
    var patchedGame;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/games/${newGame._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Game' },
          { op: 'replace', path: '/info', value: 'This is the patched game!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedGame = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedGame = {};
    });

    it('should respond with the patched game', function() {
      expect(patchedGame.name).to.equal('Patched Game');
      expect(patchedGame.info).to.equal('This is the patched game!!!');
    });
  });

  describe('DELETE /api/games/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/games/${newGame._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when game does not exist', function(done) {
      request(app)
        .delete(`/api/games/${newGame._id}`)
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
