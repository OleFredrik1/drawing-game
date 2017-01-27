'use strict';

var express = require('express');
var controller = require('./guess.controller');
var auth = require("../../auth/auth.service");
var guessSocket = require("./guess.socket");

var router = express.Router();

//router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
//router.delete('/:id', controller.destroy);

module.exports = router;
