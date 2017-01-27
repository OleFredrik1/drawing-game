/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import CommentEvents from './comment.events';
var CommentController = require("./comment.controller");

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`comment:${event}`, socket);

    CommentEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
  socket.on("send comment", function(comment){
    comment.createdAt = Date.now();
    socket.emit("comment", comment);
    socket.broadcast.to(comment.gameId+comment.password).emit("comment", comment);
    CommentController.create(comment);
  });
}




function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    CommentEvents.removeListener(event, listener);
  };
}
