"use strict";

export default class GameAddController {
  newGame={};
  /*@ngInject*/
  constructor($http, $window) {
    this.$http = $http;
    this.$window = $window;
  }
  submitNewGame = function(form){
    this.$http.post("/api/games", this.newGame)
    .then(response =>{
      this.$window.location.href = "play/" + response.data._id;
    });
  }
}