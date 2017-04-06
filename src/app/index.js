'use strict'

var express = require('express');

var router = express.Router();

var app = express();
var adminApp = express();


router.use('/public', express.static(__dirname + '/../public'));

router.use('/', express.static(__dirname + '/../../dist'));
router.use('/bower_components',  express.static(__dirname + '/../../bower_components'));

router.use('/api',require('./api'))

app.use(router);

app.listen(3000, function () {
  console.log('Server started on port 3000 !');
});

adminApp.use(router);
adminApp.use('/admin', express.static(__dirname + '/../admin'));

adminApp.listen(3001, function () {
  console.log('Server started on port 3001 !');
});


