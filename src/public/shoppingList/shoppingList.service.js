'use strict'

angular.module('shoppingListService',['ngResource']);

angular.module('shoppingListService')
    .factory('Ingredients', ['$resource', function($resource) {
    	return $resource('/api/shoppingList/:id',{},{
    		add: {method: 'PUT', isArray: true},
    		update: {method: 'PUT', params: {id: '@ingredient'}},
    		delete: {method: 'DELETE'}
    	});
    }]);