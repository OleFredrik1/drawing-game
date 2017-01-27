'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var guessCtrlStub = {
  index: 'guessCtrl.index',
  show: 'guessCtrl.show',
  create: 'guessCtrl.create',
  upsert: 'guessCtrl.upsert',
  patch: 'guessCtrl.patch',
  destroy: 'guessCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var guessIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './guess.controller': guessCtrlStub
});

describe('Guess API Router:', function() {
  it('should return an express router instance', function() {
    expect(guessIndex).to.equal(routerStub);
  });

  describe('GET /api/guesss', function() {
    it('should route to guess.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'guessCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/guesss/:id', function() {
    it('should route to guess.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'guessCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/guesss', function() {
    it('should route to guess.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'guessCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/guesss/:id', function() {
    it('should route to guess.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'guessCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/guesss/:id', function() {
    it('should route to guess.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'guessCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/guesss/:id', function() {
    it('should route to guess.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'guessCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
