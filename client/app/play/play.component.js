'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './play.routes';

export class PlayComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('nitrousApp.play', [uiRouter])
  .config(routes)
  .component('play', {
    template: require('./play.html'),
    controller: PlayComponent,
    controllerAs: 'playCtrl'
  })
  .name;
