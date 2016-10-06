"use strict";

export default class GameShowController {
  /*@ngInject*/
  constructor($http,  $scope, socket) {
    this.$http = $http;
    this.socket = socket;
  }

  $onInit(){
    this.$http.get("/api/games")
      .then(response => {
        this.games = response.data;
        this.socket.syncUpdates('game', this.games);
    });
  }
}