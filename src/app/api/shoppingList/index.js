'use strict'

var express = require('express');
var router = express.Router();
var keskonmange = require('../../database/keskonmangedb.js');

router.get('/',function(request,response) {

	keskonmange.getShoppingList("jean.dupond@nowhere.bzh").then(function(shoppingList) {
		response.send(shoppingList);
	});
});

router.put('/',function(request,response) {

	var ingredients = request.body;

	// TODO validate input here

	console.log('adding ingredient ' + JSON.stringify(ingredients))
	

	keskonmange.addToSoppingList("jean.dupond@nowhere.bzh", ingredients).then(function(shoppingList) {
		response.send(shoppingList);
	});
});


//update an ingredient in the list (set checked or not)
router.put('/:ingredient',function(request,response) {

	var ingredientId = request.params.ingredient;

	// check if checked has been set / otherwize 403

	if (request.body.checked === undefined) {
		response.status(400).send('{"code":"MISSING_PARMAETER","info":["checked"]}');
		return;
	}

	// set checked

	var ingredient = {
		ingredient: ingredientId,
		checked: request.body.checked
	};
	
    // update in database
	keskonmange.updateIngredient("jean.dupond@nowhere.bzh", ingredient).then(function(updatedIngredient) {
		response.send(updatedIngredient);
	}, function(err) {
		response.status(500).send(err);
	});
});

// delete the whole shopping list
router.delete('/all', function(request, response) {
	keskonmange.deleteSoppingList("jean.dupond@nowhere.bzh").then(function() {
		response.send('');
	});
});

// delete specific ingredient in the shopping list
router.delete('/', function(request, response) {

	var ingredients = request.body;

	keskonmange.deleteShoppingList("jean.dupond@nowhere.bzh",ingredients).then(function() {
		response.send('');
	});
});



module.exports = router;