'use strict';

var express = require('express');
var controller = require('./point.controller');
var auth = require("../../auth/auth.service");

var router = express.Router();

//router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', auth.isAuthenticated(), controller.upsert);
//router.patch('/:id', controller.patch);
//router.delete('/:id', controller.destroy);

module.exports = router;
