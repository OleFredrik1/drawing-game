'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('play', {
      url: '/play/:id',
      template: '<play></play>'
    });
}
