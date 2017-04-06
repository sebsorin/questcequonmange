'use strict'

var db = require('../src/app/database/keskonmangedb.js');
var async = require('async');

var fs = require('fs-promise');
var path = require('path');
var Promise = require('bluebird');

console.log('start');

var recipes = fs.readJSONSync(path.resolve(__dirname,'recipes.json'));
console.log('recipes are ' + recipes);
fs.readJSON(path.resolve(__dirname,'recipes.json'))
	.then(function(recipes) {
	console.log('recipes are ' + recipes);

	return Promise.each(recipes,function(recipe) {
		console.log('adding recipe :' + recipe.name);
		return fs.readFile(path.resolve(__dirname,recipe.smallPhoto))
		.then(function(data) {
			recipe.smallPhoto = data;
			console.log('small photo read');
		})
		.then(function() {
			return fs.readFile(path.resolve(__dirname,recipe.photo));
		}).then(function(data) {
			recipe.photo = data;
		}).then( function() {
			return db.addRecipe(recipe);
		});		
	} );

	}).then(function() {
		console.log('done');
	});
