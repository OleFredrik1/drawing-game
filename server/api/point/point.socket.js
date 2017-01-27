/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import PointEvents from './point.events';
var controller = require('./point.controller');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`point:${event}`, socket);

    PointEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
  socket.on("send point", function(req){
    socket.broadcast.to(req[0].gameId+req[0].password).emit("point", req);
    controller.create(req)
    .then(function(){
      socket.emit("done");
    });
    /*socket.emit("done");*/
  });
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    PointEvents.removeListener(event, listener);
  };
}
