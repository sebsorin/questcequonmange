'use strict'

angular.module('recipes',['ngResource','shoppingListService','numberInputMod']);

angular.module('recipes').config(function() {



})
.factory('Recipes', ['$resource',function($resource) {
	return $resource('/api/recipes');
}])
.directive('recipesList',[ '$state',function($state) {

	return {
		restrict: 'E',
		transclude :true,
		scope:{},
		controller: function($scope,Recipes) {
			$scope.Recipes = Recipes;
			
		},
		link: function(scope,element, attr) {
			scope.recipesType = attr.type;

			scope.open = function(){
				if (scope.closed) {
					scope.recipes = scope.Recipes.query({type:scope.recipesType});
					scope.closed = false;
				}  else {
					scope.closed = true;
				}	
			};

			scope.goto = function(recipeId) {
				console.log('va a la recette ' + recipeId);
				$state.go('.detail',{ "recipeId" : recipeId });
			};

			scope.closed = true;

			

		},
		templateUrl: '/public/recipes/recipeslist.template.html'
	};

}])
.directive('allRecipes',function() {
	return {
		restrict: 'E',
		templateUrl: '/public/recipes/recipes.template.html'
	}
});
