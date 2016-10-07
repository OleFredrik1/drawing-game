'use strict';

describe('Component: PlayComponent', function() {
  // load the controller's module
  beforeEach(module('nitrousApp.play'));

  var PlayComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PlayComponent = $componentController('play', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
