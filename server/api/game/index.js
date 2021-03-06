'use strict';

var express = require('express');
var controller = require('./game.controller');
var auth = require("../../auth/auth.service");

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
