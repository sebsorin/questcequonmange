'use strict'

var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var sharp = require('sharp');


var keskonmange = require('../../database/keskonmangedb.js');


router.post('/recipes/:id/photo', upload.single('photo'), function(request,response) {

	var recipe = {};

	recipe.photo = request.file.buffer;
	recipe.photoMimeType = request.file.mimetype;


	sharp(request.file.buffer)
	 .resize(450)
	 .toBuffer()
	 .then(function(smallPhoto) {
		recipe.smallPhoto = smallPhoto;
	 	keskonmange.updateRecipe(request.params.id, recipe);

	 })
	 .then(
		function(recipe) {
			response.send('');
	 })
	 .catch(
		function(err) {
			response.status(err.code).send(err.msg);
		});
});

module.exports = router;