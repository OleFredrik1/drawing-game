/**
 * Point model events
 */

'use strict';

import {EventEmitter} from 'events';
import Point from './point.model';
var PointEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PointEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Point.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PointEvents.emit(event + ':' + doc._id, doc);
    PointEvents.emit(event, doc);
  };
}

export default PointEvents;
