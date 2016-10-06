"use strict";

export default class GameAddController {
  newGame={/*
    name: "",
    language: "",
    password: ""
  */};
  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;
  }
  submitNewGame = function(form){
    this.$http.post("/api/games", this.newGame);
    console.log(this.newGame);
    this.newGame={};
  }
}