'use strict';

var express = require('express');
var controller = require('./guess.controller');
var auth = require("../../auth/auth.service");

var router = express.Router();

//router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
//router.delete('/:id', controller.destroy);

module.exports = router;
