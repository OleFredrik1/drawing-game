/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import GameEvents from './game.events';
var GameController = require("./game.controller");
// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`game:${event}`, socket);

    GameEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
  socket.on("new game", function(options){
    console.log("server får");
    console.log(options);
    GameController.destroyWithSocket(options.oldGameId);
    GameController.createWithSocket(options)
    .then(function(res){
      console.log(res);
      console.log("sender beskjed om nytt spill");
      console.log("ny spillid: " + res._id);
      socket.emit("new game", res._id);
      socket.broadcast.to(options.oldGameId+options.password).emit("new game", res._id);
    });
  });
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    GameEvents.removeListener(event, listener);
  };
}
