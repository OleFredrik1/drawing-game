'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';

function Socket(socketFactory) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket
  });

  var goingToSend = true;

  return {
    socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(`${modelName}:save`, function(item) {
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if(oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(`${modelName}:remove`, function(item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },

    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates(modelName) {
      socket.removeAllListeners(`${modelName}:save`);
      socket.removeAllListeners(`${modelName}:remove`);
    },
    sendPoint(point){
      socket.emit("send point", point);
      goingToSend = false;
      console.log("sender");
    },
    sendComment(comment){
      socket.emit("send comment", comment);
    },
    startNewGame(options){
      socket.emit("new game", options);
      console.log("sender beskjed om et nytt spill");
    },
    sendGuess(guess){
      socket.emit("send guess", guess);
    },
    sendHint(hint){
      socket.emit("send hint", hint);
      console.log("sender hint socket" + hint);
    },
    initializeGame(gameID, points, guesses, comments, drawer, scope, rightGuess, rightGuessed, pass){
      socket.emit("join room", gameID+pass);
      if (drawer){
        socket.on("done", function() {
            goingToSend = true;
            console.log("klar");
            if (scope.pointsToSend.length > 0){
              scope.sendPoints();
            }
        });
        console.log("gjør klar til å få done");
      }
      else{
        socket.on("point", function(data){
          console.log("fått, bare for sikkerhetsskyld");
            for (var x=0; x<data.length; x++){
              points.push(data[x]);
              console.log("fått");
            }
          });
          console.log("gjør klar til å få nytt punkt");
        socket.on("hint", function(item) {
           scope.$apply(function(){
             scope.playCtrl.game.drawnObject = item.split("").join(" ");
           }); 
           console.log("hint har kommet" + item);
        });
      }
      socket.on("comment", function(data){
        comments.push(data);
        console.log("fått");
      });
      socket.on("guess", function(data){
        guesses.push(data);
        console.log("fått");
      });
      socket.on("new game", function(gameId) {
        scope.toNewGame(gameId);
        console.log("får beskjed om nytt spill");
      })
      socket.on("right guess", function(data){
        scope.setRightGuess(data);
        console.log("får beskjed");
      });
    },
    isGoingToSend(){
      console.log(goingToSend);
      return goingToSend;
    },
  };
}

export default angular.module('nitrousApp.socket', [])
  .factory('socket', Socket)
  .name;
