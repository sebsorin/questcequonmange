
'use strict'

var questcequonmage = angular.module('questcequonmange',['ui.router','shoppingListMod', 'recipes']);


angular.module('questcequonmange')
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
    		template: '<recipes-detail recipeId={{recipeId}}></recipes-detail>',
    		controller: function($scope, $stateParams) {
       			$scope.recipeId = $stateParams.recipeId
    		}
    	}) 
      .state('recipes.detail.addIngredients', {
        url: '/addIngredients'
      }) 
    	.state('cart', {
    		url: '/courses',
    	template: '<shopping-list></shopping-list>'
    });
    		
})	
.run(function() {
	console.log('Startup..');
})
.controller('toto', ['$scope', function( $scope ) {
	console.log('in toto');
	$scope.coucou = 'seb';
}])