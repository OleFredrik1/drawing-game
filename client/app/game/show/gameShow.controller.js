"use strict";

export default class GameShowController {
  /*@ngInject*/
  constructor($http,  $scope, $window, $document, socket) {
    this.$http = $http;
    this.socket = socket;
    this.$window = $window;
    this.$document = $document;
  }
  
  addStorage = function (id){
    console.log(this.$document);
    console.log(this.$document[0].getElementById(id));
    this.$window.sessionStorage.setItem("game", JSON.stringify({"gameId": id, "password": this.$document[0].getElementById(id).value}));
    console.log(JSON.stringify({"gameId": id, "password": this.$document.find(id)[0].value})); //finner bare gameiden?  Merkelig resultat?
  };
  
  $onInit(){
    this.$http.get("/api/games")
      .then(response => {
        this.games = response.data;
        this.socket.syncUpdates('game', this.games);
        console.log(this.games);
    });
  }
}