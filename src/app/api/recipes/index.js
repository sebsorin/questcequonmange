'use strict'

var express = require('express');
var router = express.Router();
var keskonmange = require('../../database/keskonmangedb.js');

router.get('/',function(request,response) {

	var last = request.query.start ? request.query.start : 0;
	var page = request.query.page ? request.query.page : 10;

	keskonmange.getRecipes(last,page,request.query.type)
	.then(
		function(recipes) {
			recipes.forEach(function(recipe) {
				recipe._doc.smallPhotoUrl = "/api/recipes/" + recipe.id + "/smallPhoto";
				recipe._doc.photoUrl = "/api/recipes/" + recipe.id + "/photo";
			})
			response.send(recipes);
		},
		function(err) {
			console.log(err);
			response.status(err.code).send(err.msg);
		});
});

router.get('/:id',function(request,response) {

	keskonmange.getRecipe(request.params.id)
	.then(
		function(recipe) {
			recipe._doc.smallPhotoUrl = "/api/recipes/" + recipe.id + "/smallPhoto";
			recipe._doc.photoUrl = "/api/recipes/" + recipe.id + "/photo";
			response.send(recipe);
		},
		function(err) {
			response.status(err.code).send(err.msg);
		});
});


router.put('/',function(request,response) {

	keskonmange.createRecipe(request.body)
	.then(
		function(recipe) {
			recipe._doc.smallPhoto = "/api/recipes/" + recipe.id + "/smallPhoto";
			recipe._doc.photoUrl = "/api/recipes/" + recipe.id + "/photo";
			response.send(recipe);
		},
		function(err) {
			response.status(err.code).send(err.msg);
		});
});


router.post('/:id',function(request,response) {

	var recipe = request.body;

    // if we have a photo uploaded in form of a url, then change it
	if(recipe.photoUrl && recipe.photoUrl.startsWith('data:')) {
		var res = /data\:(.*);base64,(.*)/.exec(recipe.photoUrl)
		if(res) {
			recipe.photo = Buffer.from(res[1], 'base64');
			recipe.photoMimeType = res[0];
		}
	}

	keskonmange.updateRecipe(request.params.id, request.body)
	.then(
		function(recipe) {
			recipe._doc.smallPhoto = "/api/recipes/" + recipe.id + "/smallPhoto";
			recipe._doc.photoUrl = "/api/recipes/" + recipe.id + "/photo";
			response.send(recipe);
		},
		function(err) {
			response.status(err.code).send(err.msg);
		});
});

function getPhoto(request,response,photoType) {
	keskonmange.getRecipePhoto(request.params.id, photoType)
	.then(
		function(photo) {
			response.type('jpg');
			response.send(photo);
		},
		function(err) {
			response.status(err.code).send(err.msg);
		});
}

router.get('/:id/photo',function(request,response) {
	getPhoto(request, response, 'big');
});

router.get('/:id/smallPhoto',function(request,response) {
	getPhoto(request, response, 'small');
});

module.exports = router;