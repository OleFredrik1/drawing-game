/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/guesss              ->  index
 * POST    /api/guesss              ->  create
 * GET     /api/guesss/:id          ->  show
 * PUT     /api/guesss/:id          ->  upsert
 * PATCH   /api/guesss/:id          ->  patch
 * DELETE  /api/guesss/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Guess from './guess.model';
import Game from '../game/game.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// // Gets a list of Guesss
// export function index(req, res) {
//   return Game.findById(req.body.gameId, "guesses").exec()
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Gets a single Guess from the DB
export function show(req, res) {
  return Game.findById(req.params.id, "guesses").exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Guess in the DB
export function create(req, res) {
  return Game.findByIdAndUpdate(
    req.body.gameId,
    {$push: {"guesses": {user: req.user.name, guess: req.body.guess, createdAt: Date.now()}}},
    {safe: true, upsert: true, new: true})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// // Upserts the given Guess in the DB at the specified ID
// export function upsert(req, res) {
//   if(req.body._id) {
//     delete req.body._id;
//   }
//   return Guess.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// // Updates an existing Guess in the DB
// export function patch(req, res) {
//   if(req.body._id) {
//     delete req.body._id;
//   }
//   return Guess.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(patchUpdates(req.body))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// // Deletes a Guess from the DB
// export function destroy(req, res) {
//   return Guess.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(removeEntity(res))
//     .catch(handleError(res));
// }
