/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/points              ->  index
 * POST    /api/points              ->  create
 * GET     /api/points/:id          ->  show
 * PUT     /api/points/:id          ->  upsert
 * PATCH   /api/points/:id          ->  patch
 * DELETE  /api/points/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Game from "../game/game.model";
import Point from './point.model';

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

// Gets a list of Points
// export function index(req, res) {
//   return Point.find().exec()
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Gets a single Point from the DB
export function show(req, res) {
  return Game.findById(req.params.id, "points").exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Point in the DB
export function create(req, res) {
  return Game.findOneAndUpdate(
    {_id: req[0].gameId, drawerToken: req[0].drawerToken},
    {$push: {"points": {$each: req}}},
    {safe: true, upsert: true, new: true});
}

// // Upserts the given Point in the DB at the specified ID
// export function upsert(req, res) {
//   if(req.body._id) {
//     delete req.body._id;
//   }
//   return Point.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// // Updates an existing Point in the DB
// export function patch(req, res) {
//   if(req.body._id) {
//     delete req.body._id;
//   }
//   return Point.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(patchUpdates(req.body))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// // Deletes a Point from the DB
// export function destroy(req, res) {
//   return Point.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(removeEntity(res))
//     .catch(handleError(res));
// }
