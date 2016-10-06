"use strict";

const angular = require('angular');


const uiRouter = require('angular-ui-router');

import routes from './game.routes';

import gameShow from "./show";

import gameAdd from "./add";

export default angular.module('nitrousApp.game', [uiRouter, gameShow, gameAdd])
  .config(routes)
  .name;
