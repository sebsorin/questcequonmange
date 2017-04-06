'use strict'

var Promise = require("bluebird");
var expect = require('chai').expect;


module.exports = function() {

	var Client = require('node-rest-client').Client;

	var client = new Client();



	// registering remote methods 
	client.registerMethod("getShoppingList", "http://localhost:3000/api/shoppingList", "GET");


	// registering remote methods 
	client.registerMethod("addIngredients", "http://localhost:3000/api/shoppingList/", "PUT");


	function restClientPromisifier(originalMethod) {
		// return a function
    	return function promisified() {
        	var args = [].slice.call(arguments);
        	// Needed so that the original method can be called with the correct receiver
        	var self = this;
        	// which returns a promise
        	return new Promise(function(resolve, reject) {
            	args.push(function(data, response){
                	resolve([data, response]);
            	});
            	var req = originalMethod.apply(self, args);
            	req.on('error', function(err){
            		reject(err);
            	})
        	});
    	};	
	}


	Promise.promisifyAll(client.methods,{promisifier: restClientPromisifier});

	var currentResponse;
 
 
	this.Given(/I am \'([^\']*)\'/, function(user) {
		console.log('I am ' + user );
	});

	this.When(/I add the ingredients \'([^\']*)\'/ , function(ingredientsString) {
		var ingredients = JSON.parse(ingredientsString);
	
		var args = {
    		data: ingredients,
    		headers: { "Content-Type": "application/json" }
		};
 

		// 
		return client.methods.addIngredientsAsync(args).then(function (args) {
    		// parsed response body as js object 
    		//console.log(data);
    		// raw response 
    		console.log(args[0]);

    		currentResponse = args[1];
    	
		});
	}); 

	this.When(/I get my shopping list/ , function(cb) {
		client.methods.getShoppingList(function (args) {
    		// parsed response body as js object 
    		console.log('shopping list is' + JSON.stringify(args[1]));
    		// raw response 
    		//console.log(response);

    		currentResponse = args[1];
    		cb();
		});
	}); 

	this.Then((/result is (\d+)/), function(result) {
		expect(currentResponse.statusCode).to.equal(parseInt(result));
	});

	this.Then((/the shoppinglist contains \'([^\']*)\'/), function(result) {
		expect(currentResponse)

	});

};