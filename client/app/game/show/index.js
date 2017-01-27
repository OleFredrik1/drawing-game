'use strict';

import angular from 'angular';
import GameShowController from './gameShow.controller';

export default angular.module('nitrousApp.gameShow', [])
  .controller('GameShowController', GameShowController)
  .name;