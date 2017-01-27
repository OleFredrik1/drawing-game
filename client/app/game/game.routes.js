'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('gameShow', {
      url: "/game",
      template: require('./show/gameShow.pug'),
      controller: "GameShowController",
      controllerAs: 'gameShowCtrl'
    })
    .state("gameAdd", {
      url: "/game/new",
      template: require("./add/gameAdd.pug"),
      controller: "GameAddController",
      controllerAs: "gameAddCtrl",
      authenticate: true
    });
}
