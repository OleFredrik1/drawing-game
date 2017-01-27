'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pointCtrlStub = {
  index: 'pointCtrl.index',
  show: 'pointCtrl.show',
  create: 'pointCtrl.create',
  upsert: 'pointCtrl.upsert',
  patch: 'pointCtrl.patch',
  destroy: 'pointCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pointIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './point.controller': pointCtrlStub
});

describe('Point API Router:', function() {
  it('should return an express router instance', function() {
    expect(pointIndex).to.equal(routerStub);
  });

  describe('GET /api/points', function() {
    it('should route to point.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'pointCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/points/:id', function() {
    it('should route to point.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'pointCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/points', function() {
    it('should route to point.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'pointCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/points/:id', function() {
    it('should route to point.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'pointCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/points/:id', function() {
    it('should route to point.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'pointCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/points/:id', function() {
    it('should route to point.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'pointCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
