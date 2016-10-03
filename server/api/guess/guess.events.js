/**
 * Guess model events
 */

'use strict';

import {EventEmitter} from 'events';
import Guess from './guess.model';
var GuessEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GuessEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Guess.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    GuessEvents.emit(event + ':' + doc._id, doc);
    GuessEvents.emit(event, doc);
  };
}

export default GuessEvents;
