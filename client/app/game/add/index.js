'use strict';

import angular from 'angular';
import GameAddController from './gameAdd.controller';

export default angular.module('nitrousApp.gameAdd', [])
  .controller('GameAddController', GameAddController)
  .name;
