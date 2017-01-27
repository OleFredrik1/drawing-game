/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import GuessEvents from './guess.events';
var GuessController = require("./guess.controller");

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`guess:${event}`, socket);

    GuessEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
  socket.on("send guess", function(guess){
    GuessController.index(guess)
    .then(function(res){;
      if (res){
        console.log("Skal sende rett svar");
        socket.emit("right guess", guess);
        socket.broadcast.to(guess.gameId+guess.password).emit("right guess", guess);
      }
    });/*
    GuessController.index(guess)
    .then(function(res){
      console.log("Wrong answer: " + Boolean(res));
    });
    GuessController.index({gameId: guess.gameId, guess: "dette"})
    .then(function(res){
      console.log("Right answer: " + Boolean(res));
      console.log("Type:" + typeof(res));
    });*/
    guess.createdAt = Date.now()
    socket.emit("guess", guess);
    socket.broadcast.to(guess.gameId).emit("guess", guess);
    GuessController.create(guess);
  });
}



function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    GuessEvents.removeListener(event, listener);
  };
}
