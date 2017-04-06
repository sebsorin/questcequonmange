
'use strict'

var questcequonmage = angular.module('questcequonmangeadmin',['ui.router','shoppingListMod', 'recipes']);


angular.module('questcequonmangeadmin')
.config(function($stateProvider, $urlRouterProvider) {
	// go to recettes anyway
	$urlRouterProvider.otherwise('/recettes');

		//
  	$stateProvider
    	.state('recipes', {
      		url: '/recettes',
      		template: '<all-recipes></all-recipes>'
    	})
    	.state('recipes.detail', {
    		url: '/detail/:recipeId',
    		template: '<edit-recipe recipeId={{recipeId}}></edit-recipe>',
    		controller: function($scope, $stateParams) {
       			$scope.recipeId = $stateParams.recipeId
    		}
    	});
    		
})	
.run(function() {
	console.log('Startup admin..');
})