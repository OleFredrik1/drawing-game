'use strict';

var app = require('../..');
import request from 'supertest';

var newPoint;

describe('Point API:', function() {
  describe('GET /api/points', function() {
    var points;

    beforeEach(function(done) {
      request(app)
        .get('/api/points')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          points = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(points).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/points', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/points')
        .send({
          name: 'New Point',
          info: 'This is the brand new point!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPoint = res.body;
          done();
        });
    });

    it('should respond with the newly created point', function() {
      expect(newPoint.name).to.equal('New Point');
      expect(newPoint.info).to.equal('This is the brand new point!!!');
    });
  });

  describe('GET /api/points/:id', function() {
    var point;

    beforeEach(function(done) {
      request(app)
        .get(`/api/points/${newPoint._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          point = res.body;
          done();
        });
    });

    afterEach(function() {
      point = {};
    });

    it('should respond with the requested point', function() {
      expect(point.name).to.equal('New Point');
      expect(point.info).to.equal('This is the brand new point!!!');
    });
  });

  describe('PUT /api/points/:id', function() {
    var updatedPoint;

    beforeEach(function(done) {
      request(app)
        .put(`/api/points/${newPoint._id}`)
        .send({
          name: 'Updated Point',
          info: 'This is the updated point!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPoint = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPoint = {};
    });

    it('should respond with the original point', function() {
      expect(updatedPoint.name).to.equal('New Point');
      expect(updatedPoint.info).to.equal('This is the brand new point!!!');
    });

    it('should respond with the updated point on a subsequent GET', function(done) {
      request(app)
        .get(`/api/points/${newPoint._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let point = res.body;

          expect(point.name).to.equal('Updated Point');
          expect(point.info).to.equal('This is the updated point!!!');

          done();
        });
    });
  });

  describe('PATCH /api/points/:id', function() {
    var patchedPoint;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/points/${newPoint._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Point' },
          { op: 'replace', path: '/info', value: 'This is the patched point!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPoint = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPoint = {};
    });

    it('should respond with the patched point', function() {
      expect(patchedPoint.name).to.equal('Patched Point');
      expect(patchedPoint.info).to.equal('This is the patched point!!!');
    });
  });

  describe('DELETE /api/points/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/points/${newPoint._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when point does not exist', function(done) {
      request(app)
        .delete(`/api/points/${newPoint._id}`)
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
