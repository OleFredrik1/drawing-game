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
  lastPoint = -1;
  timeToRedirect = 8;
  ongoingInterval = false;
  colors = ["black", "red", "orange", "yellow", "green", "blue", "purple"];
  /*@ngInject*/
  constructor($http, $stateParams, $scope, $window, socket, Auth) {
    "ngInject";
    $scope.$watchCollection("playCtrl.game.points", function(newP, oldP){
      console.log($scope.playCtrl.game.points);
      if (newP.length){
        if ($scope.playCtrl.lastPoint<0){
          for (var x = $scope.playCtrl.lastPoint + 1; x < $scope.playCtrl.game.points.length; x++){
            var point = $scope.playCtrl.game.points[x];
            $scope.draw(point.x, point.y, point.color, point.size, point.startPoint);
            $scope.playCtrl.lastPoint = x;
          }
        }
        else if(!$scope.playCtrl.ongoingInterval){
          $scope.playCtrl.ongoingInterval = true;
          $scope.playCtrl.pointInterval = $scope.playCtrl.$window.setInterval(function(){
            $scope.playCtrl.lastPoint = $scope.playCtrl.lastPoint + 1;
            var point = $scope.playCtrl.game.points[$scope.playCtrl.lastPoint];
            $scope.draw(point.x, point.y, point.color, point.size, point.startPoint);
            if ($scope.playCtrl.lastPoint == $scope.playCtrl.game.points.length - 1){
              $scope.playCtrl.ongoingInterval = false;
              $scope.playCtrl.$window.clearInterval($scope.playCtrl.pointInterval);
            }
          }, 10);
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
    this.$window = $window;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }
  $onInit(){
    this.passVar = (this.$window.sessionStorage.game && JSON.parse(this.$window.sessionStorage.game).gameId === this.gameId) ? JSON.parse(this.$window.sessionStorage.game) : {gameId: this.gameId, password: ''};
    var controllerVars = this;
    this.$http.post("/api/games/" + this.gameId, this.passVar)
    .then(function successCallback(response){
      console.log(response);
      controllerVars.game = response.data;
      controllerVars.isDrawer = controllerVars.getCurrentUser().name === controllerVars.game.drawer;
      if (controllerVars.isDrawer){
        controllerVars.$scope.setDrawer();
      }
      controllerVars.socket.initializeGame(controllerVars.gameId, controllerVars.game.points, controllerVars.game.guesses, controllerVars.game.comments, controllerVars.isDrawer, controllerVars.$scope, controllerVars.rightGuess, controllerVars.rightGuessed, controllerVars.passVar.password);
      }, function errorCallback(){
        alert("Sorry, wrong password or invalid game.");
        controllerVars.$window.history.back();
      }
    );
  }
  countdown = function(){
    this.$scope.$apply(function(){
      this.timeToRedirect--;
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
        scope.counter = vars.lastPoint || 0;
        scope.color = "black";
        scope.size = 3;
        scope.gameId = vars.gameId;
        scope.pointsToSend = [];
        var eraser = angular.element(document.getElementById("eraser"));
        var guessInput = angular.element(document.getElementById("guess"));
        var maincontainer = document.getElementById("main-container");
        var wrapper = document.getElementsByClassName("wrapper")[0];
        angular.element(document).on("unload", function(){
          vars.socket.emit("avlogger");
        });
        angular.element(document).on("mouseup", function(){
          scope.mouseDown = false;
        });
        scope.distanceBetween = function(point1, point2) {
          return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        };
        scope.angleBetween  = function(point1, point2) {
          return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        };
        scope.setDrawer = function(){
          element.on("mousedown", scope.pressMouseDown);
          element.on("mousemove", scope.moveMouse);
          scope.sendHints();
        };
        scope.getSize = function(){
          return parseInt(scope.size);
        };
        scope.findLetter = function(text){
          var x = Math.floor(Math.random() * text.length);
          if (text[x] === "*"){
            return x;
          }
          else{
            return scope.findLetter(text);
          }
        };
        scope.sendHints = function(){
          scope.hintString = "*".repeat(vars.game.drawnObject.length);
          scope.hintLoop = window.setInterval(function(){
            var letterNumber = scope.findLetter(scope.hintString);
            var stringArray = scope.hintString.split("");
            stringArray[letterNumber] = vars.game.drawnObject[letterNumber];
            scope.hintString = stringArray.join("");
            vars.socket.sendHint({gameId: scope.gameId, hintString: scope.hintString, password: vars.passVar.password});
            console.log("sender");
            if (scope.hintString === vars.game.drawnObject){
              window.clearInterval(scope.hintLoop);
            }
          }, 20000);
        };
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
          var size = scope.getSize();
          var x = $event.pageX - scope.canvas.offsetLeft - maincontainer.offsetLeft;
          var y = $event.pageY - scope.canvas.offsetTop - maincontainer.offsetTop - wrapper.offsetTop - 49;
          console.log(x,y);
          scope.counter++;
          console.log(scope.size);
          scope.pointsToSend.push({ "gameId": scope.gameId, "x" : x, "y" : y, "color": scope.color, "size": size, "order": scope.counter, startPoint: true, "drawerToken": vars.game.drawerToken, password: vars.passVar.password});
          if (vars.socket.isGoingToSend()){
            scope.sendPoints();
          }
          scope.draw(x, y, scope.color, size, true);
          scope.lastTime = Date.now();
          console.log(vars.game.points);
        };
        scope.test = function(){
          console.log("funker");
        };
        scope.moveMouse = function($event){
          if (scope.mouseDown){
            var size = scope.getSize();
            var x = $event.pageX - scope.canvas.offsetLeft - maincontainer.offsetLeft;
            var y = $event.pageY - scope.canvas.offsetTop - maincontainer.offsetTop - wrapper.offsetTop - 49;
            console.log(x,y);
            scope.counter++;
            console.log(scope.size);
            scope.pointsToSend.push({ "gameId": scope.gameId, "x" : x, "y" : y, "color": scope.color, "size": size, "order": scope.counter, startPoint: false, "drawerToken": vars.game.drawerToken, password: vars.passVar.password});
            if (vars.socket.isGoingToSend()){
              scope.sendPoints();
            }
            scope.draw(x, y, scope.color, size, false);
            vars.lastPoint = scope.counter;
            console.log(Date.now()-scope.lastTime);
            scope.lastTime = Date.now();
          }
        };
        scope.sendPoints = function(){
          vars.socket.sendPoint(scope.pointsToSend);
          scope.pointsToSend = [];
        };
        scope.draw = function(x, y, pointColor, size, startPoint){ // Based on this: http://perfectionkills.com/exploring-canvas-drawing-techniques/
          scope.c.fillStyle = pointColor;
          scope.c.strokeStyle = pointColor;
          var currentPoint = {x: x, y: y};
          scope.lastPoint = scope.lastPoint || {x : x, y : y};
          var dist = scope.distanceBetween(scope.lastPoint, currentPoint);
          var angle = scope.angleBetween(scope.lastPoint, currentPoint);
          if (startPoint){
            scope.drawPoint(x, y, size);
          }
          else{ 
            for (var n = 0; n<dist; n+=size){
              var newX = scope.lastPoint.x + (Math.sin(angle) * n);
              var newY = scope.lastPoint.y + (Math.cos(angle) * n);
              scope.drawPoint(newX, newY, size);
            }
          }
          scope.lastPoint = {x : x, y : y};
          /*console.log(preX, preY, x, y, pointColor);*/
        };
        scope.drawPoint = function(x, y, size){
          scope.c.beginPath();
          scope.c.arc(x, y, size, 0, 2*Math.PI);
          scope.c.stroke();
          scope.c.fill();
        };
        vars.sendComment = function(){
          vars.newComment.user = vars.getCurrentUser().name;
          vars.newComment.gameId = scope.gameId;
          vars.newComment.password = vars.passVar.password;
          vars.socket.sendComment(vars.newComment);
          vars.newComment = {};
        };
        vars.sendGuess = function(){
          vars.newGuess.user = vars.getCurrentUser().name;
          vars.newGuess.gameId = scope.gameId;
          vars.newGuess.guess = vars.newGuess.guess.toLowerCase();
          vars.newGuess.password = vars.passVar.password;
          vars.socket.sendGuess(vars.newGuess);
          vars.newGuess = {};
        };
        scope.setRightGuess = function(guess){
          console.log("setter");
          vars.rightGuess = guess;
          vars.rightGuessed = true;
          console.log(guess.user);
          console.log(vars.getCurrentUser().name);
          console.log("Trippel" + guess.user === vars.getCurrentUser().name);
          console.log("Dobbel" + guess.user == vars.getCurrentUser().name);
          if (guess.user === vars.getCurrentUser().name){
            console.log("gjør klar til å sende beskjed om nytt spill");
            vars.socket.startNewGame({drawer: guess.user, language: vars.game.language, name: vars.game.name, oldGameId: vars.gameId, password: vars.passVar.password});
          }
        };
        scope.toNewGame = function(newId){
          console.log("setter igang nytt spill");
          if (document.hidden){
            window.sessionStorage.setItem("game", JSON.stringify({gameId: newId, password: vars.passVar.password}));
            window.location = "https://the-drawing-game.herokuapp.com/play/"+newId;
          }
          else{
            window.setInterval(function(){/*
              vars.countdown();*/
              scope.$apply(function(){
                vars.timeToRedirect--;
              });
              console.log(vars.timeToRedirect);
              if (document.hidden){
                window.sessionStorage.setItem("game", JSON.stringify({gameId: newId, password: vars.passVar.password}));
                window.location = "https://the-drawing-game.herokuapp.com/play/"+newId;
              }
            }, 1000);
            window.setTimeout(function(){
              window.sessionStorage.setItem("game", JSON.stringify({gameId: newId, password: vars.passVar.password}));
              window.location = "https://the-drawing-game.herokuapp.com/play/"+newId;
            }, 7000);
          }
        }
      }
    };
  })
  .name;
