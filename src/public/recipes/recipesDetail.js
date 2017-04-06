'use strict'

angular.module('recipes')
.factory('Recipe', ['$resource',function($resource) {
	return $resource('/api/recipes/:id');
}])
.directive('recipesDetail',['$state', function($state) {

	return {
		restrict: 'E',
		transclude :true,
		scope:{},
		controller: function($scope,Recipe, Ingredients) {
			$scope.RecipeService = Recipe;
			$scope.IngredientsService = Ingredients;
			
		},
		link: function($scope,element, attr) {
			$scope.recipe = $scope.RecipeService.get({id:attr.recipeid},recipe => {
					$scope.recipe.origNbPersons = $scope.recipe.nbPerson;
					$scope.recipe.ingredients.forEach(ingredient => {
						ingredient.origQuantity = ingredient.quantity;
					});
					return recipe;	
				});
			$scope.$watch('recipe.nbPerson', function() {
				if ($scope.recipe.ingredients) {
					$scope.recipe.ingredients.forEach(ingredient => {
						ingredient.quantity = ingredient.origQuantity * $scope.recipe.nbPerson / $scope.recipe.origNbPersons;
					})
				}
			})
			$scope.addIngredients = 'TODO';
			$scope.addToCart = function() {
				$scope.IngredientsService.add($scope.recipe.ingredients,function() {
					$scope.addIngredients = 'OK';
				},
				function(err) {
					$scope.addIngredients = err;	
				}
				);	
			};
			
		},
		templateUrl: '/public/recipes/recipesdetail.template.html'
	};

}])