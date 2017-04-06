'use strict'

var mongoose = require('mongoose');

// connect to mongo db database
mongoose.connect('mongodb://localhost/keskonmange');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

/*******************************************************************************************/
// User model from schema
var userSchema = new mongoose.Schema({
	email: String,
    lastName: String,
    firstName: String,
    shoppingList : [
    	{
    		ingredient: String,
    		quantity: Number,
    		unit: String,
    		checked: Boolean
    	}
    ]
});

var User = mongoose.model('User',userSchema);

/***********************************************************************************************/
// Recipe model
var recipeSchema = new mongoose.Schema({
	name: String,
	type: String, // desert, entry, mainCourse
	descrition: String,
	photo: Buffer,
	smallPhoto: Buffer,
    rating: Number,
    nbPerson: Number,
    difficulty: Number,
    steps : [ {
    	description : String
    }
    ],
    ingredients : [
    	{
    		ingredient: String,
    		quantity: Number,
    		unit: String
    	}
    ]
});

var Recipe = mongoose.model('Recipe',recipeSchema);


/***********************************************************************************************/
// dao for keskonmange database
var keskonmange = {

    /**
     * Shopping list
     */

    // get user from email
    getUser: function(userEmail, filter) {
     	return User.find({email: userEmail}, filter).then(function(user) {
			if (user.length >= 1) {
				return user[0];
			} else {
				throw {code:404, msg: "User " + userEmail + " not found"};
			}
		},function(err) {
			console.log('error accessing db:' + err);
			throw {code: 503, msg: err};
		});
    },

    // get the chopping list for a given user
	getShoppingList: function(userEmail) {
		console.log('get user ' + userEmail);
		return this.getUser(userEmail).then(function(user) {
			return user.shoppingList;
		});
	},

    // add ingredients to shopping list for a given user
	addToSoppingList: function(userEmail, ingredients) {
		return this.getUser(userEmail).then(function(user) {

				
			ingredients.forEach( ingredient => {

				// look if ingredient is already in shopping list

				var existingIngredient = user.shoppingList.find( elem => {
					return elem.ingredient === ingredient.ingredient && 
							elem.unit === ingredient.unit;
				});

				// if it is, just update quantity

				if (existingIngredient) {
					existingIngredient._doc.quantity += ingredient.quantity;
				} else {
					//otherwize add it to list
					user.shoppingList.push({
						ingredient: ingredient.ingredient,
						quantity: ingredient.quantity,
						unit: ingredient.unit,
						bought: false
					});
				}
			});
			return user.save().then(function() {
					return user.shoppingList;;
				})
			});
	},

	// update an ingredient in the shopping list

	updateIngredient: function(userEmail, ingredient) {

		    var command = {};
	
			// set the quantity
			if(typeof ingredient.quantity !== 'undefined') {
				command["shoppingList.$.quantity"] = ingredient.quantity;
			}
			
			// set checked flag
			if(typeof ingredient.checked !== 'undefined') {
				command["shoppingList.$.checked"]  = ingredient.checked;
			}

			return User.update({ email:userEmail, 'shoppingList.ingredient': ingredient.ingredient } , {'$set': command}).then(function() {
				return '';
			});
	
	},

	deleteShoppingList: function(userEmail) {
		return this.getUser(userEmail,{shoppingList:1}).then(function(user) {
			user.shoppingList = [];
			return user.save().then(function() {
				return user.shoppingList ;
			});
		});
	},


	/**
	 * Recipes
	 */

	getRecipes: function(last,page,type) {
	//	var query = {'name': {$gt: last} };
		var query = {};

		if (type) {
			query.type = type;
		}

		return Recipe.find(query,{name: 1, type: 1, description: 1, rating:1, nbPerson:1 , difficulty:1})
		.limit(page)
		.sort('-name');
	},

	getRecipe: function(recipeId) {
		return Recipe.findById(recipeId, {photo: 0, smallPhoto: 0})
			.then(function(recipe){
				return recipe;
			},function(err) {
			console.log('error accessing db:' + err);
			throw {code: 503, msg: err};
			});
			
	},

	getRecipePhoto: function(recipeId, type) {

		var select = {photo: 1};

		if (type === 'small') {
			select = {smallPhoto: 1};			
		}

		return Recipe.findById(recipeId, select).then(function(recipe) {
			if(type === 'small') {
				return recipe.smallPhoto;		
			} else {
				return recipe.photo;
			}
		});
	},

	addRecipe: function(recipe) {
		var recipeDb  =  new Recipe(recipe);
		return recipeDb.save();
	},

	updateRecipe: function(id, recipe) {
		return Recipe.findByIdAndUpdate(id,{$set: recipe}, {new: true})
		.then(function(newRecipe) {
			delete newRecipe._doc.smallPhoto;
			delete newRecipe._doc.photo;
			return newRecipe;
		});
	}

}

module.exports = keskonmange;
