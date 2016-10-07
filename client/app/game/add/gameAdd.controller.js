"use strict";

export default class GameAddController {
  newGame={};
  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;
  }
  submitNewGame = function(form){
    this.$http.post("/api/games", this.newGame);
    this.newGame={};
  }
}