'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './play.routes';


export class PlayComponent {
  rightGuessed = false;
  rightGuess = {};
  game = {
    drawnObject: "false",
    points:{}
  };
  newGuess = {
    guess: ""
  };
  newComment = {};
  isDrawer = false;
  lastPoint = 0;
  colors = ["black", "red", "orange", "yellow", "green", "blue", "purple"]
  /*@ngInject*/
  constructor($http, $stateParams, $scope, socket, Auth) {
    "ngInject";
    $scope.$watchCollection("playCtrl.game.points", function(newP, oldP){
      console.log($scope.playCtrl.game.points);
      if (newP.length){
        for (var x = $scope.playCtrl.lastPoint; x < $scope.playCtrl.game.points.length; x++){
          var point = $scope.playCtrl.game.points[x];
          $scope.draw(point.lastX, point.lastY, point.x, point.y, point.color);
          $scope.playCtrl.lastPoint = x;
        }
      }
    });
    $scope.$watchCollection("playCtrl.game", function(newP, oldP){
      console.log(newP);
    });
    this.$http = $http;
    this.gameId = $stateParams.id;
    this.$scope = $scope;
    this.socket = socket;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }
  $onInit(){
    this.$http.get("/api/games/" + this.gameId)
    .then(response =>{
      this.game = response.data;
      this.isDrawer = this.getCurrentUser().name === this.game.drawer;
      if (this.isDrawer){
        this.$scope.setDrawer();
      }
      console.log(response.data);
       this.socket.syncUpdates('game', this.game);
      console.log(this.$scope);
    });
  }
  addNewComment = function(){
    this.newComment.gameId = this.gameId;
    this.$http.post("/api/comments/", this.newComment)
    .then(response => {
      this.newComment = {};
    });
  }
  addNewGuess = function(){
    this.newGuess.gameId = this.gameId;
    this.$http.post("/api/guesss/", this.newGuess)
    .then(function(){
      this.newGuess = {};
    });
  }
}

export default angular.module('nitrousApp.play', [uiRouter])
  .config(routes)
  .component('play', {
    template: require('./play.pug'),
    controller: PlayComponent,
    controllerAs: 'playCtrl'
  })
  .directive('canvas', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var vars = scope.playCtrl;
        scope.canvas = element[0];
        scope.c = scope.canvas.getContext("2d");
        console.log(scope.canvas);
        console.log(scope);
        scope.mouseDown = false;
        scope.lastX = 0;
        scope.lastY = 0;
        scope.counter = 0;
        scope.color = "black";
        scope.gameId = vars.gameId;
        var eraser = angular.element(document.getElementById("eraser"));
        var guessInput = angular.element(document.getElementById("guess"));
        angular.element(document).on("unload", function(){
          vars.socket.emit("avlogger");
        });
        angular.element(document).on("mouseup", function(){
          scope.mouseDown = false;
        });
        scope.setDrawer = function(){
          element.on("mousedown", scope.pressMouseDown);
          element.on("mousemove", scope.moveMouse);
        }
        guessInput.on("keydown", function($event) {
          console.log($event);
          if ($event.which === 32){
              $event.preventDefault();
           }
        });
        guessInput.on("change", function() {
          guessInput.val(guessInput.val().replace(/\s/g, ""));
        });
        scope.pressMouseDown = function ($event){
          scope.mouseDown = true;
          scope.lastX = $event.pageX - scope.canvas.offsetLeft;
          scope.lastY = $event.pageY - scope.canvas.offsetTop;
          console.log(vars.game.points);
        }
        scope.test = function(){
          console.log("funker");
        }
        scope.moveMouse = function($event){
          if (scope.mouseDown){
            var x = $event.pageX - scope.canvas.offsetLeft;
            var y = $event.pageY - scope.canvas.offsetTop;
            scope.counter++;
            vars.$http.post("/api/points", { "gameId": scope.gameId, "lastX" : scope.lastX, "lastY" : scope.lastY, "x" : x, "y" : y, "color": scope.color, "order": scope.counter});
            scope.draw(scope.lastX, scope.lastY, x, y, scope.color);
            vars.lastPoint = scope.counter;
            scope.lastX = $event.pageX - scope.canvas.offsetLeft;
            scope.lastY = $event.pageY - scope.canvas.offsetTop;
          }
        }
        scope.draw = function(preX, preY, x, y, pointColor){
          scope.c.strokeStyle = pointColor;
          scope.c.beginPath();
          scope.c.moveTo(preX, preY);
          scope.c.lineTo(x, y);
          scope.c.stroke();
          /*console.log(preX, preY, x, y, pointColor);*/
        }
      }
    };
  })
  .name;
