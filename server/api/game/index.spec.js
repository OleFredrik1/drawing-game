'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var gameCtrlStub = {
  index: 'gameCtrl.index',
  show: 'gameCtrl.show',
  create: 'gameCtrl.create',
  upsert: 'gameCtrl.upsert',
  patch: 'gameCtrl.patch',
  destroy: 'gameCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var gameIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './game.controller': gameCtrlStub
});

describe('Game API Router:', function() {
  it('should return an express router instance', function() {
    expect(gameIndex).to.equal(routerStub);
  });

  describe('GET /api/games', function() {
    it('should route to game.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'gameCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/games/:id', function() {
    it('should route to game.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'gameCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/games', function() {
    it('should route to game.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'gameCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/games/:id', function() {
    it('should route to game.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'gameCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/games/:id', function() {
    it('should route to game.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'gameCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/games/:id', function() {
    it('should route to game.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'gameCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
