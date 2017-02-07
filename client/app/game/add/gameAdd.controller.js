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
      this.$window.sessionStorage.setItem("game", JSON.stringify({"gameId": response.data._id, "password": this.newGame.password || ""}));
      this.$window.location.href = "play/" + response.data._id;
    });
  }
}