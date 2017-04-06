'use strict'

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use('/upload', require('./upload'));

// parse json objects
router.use(bodyParser.json()); 

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

router.use('/',nocache);
router.use('/shoppingList',require('./shoppingList'));
router.use('/recipes',require('./recipes'));

module.exports = router;