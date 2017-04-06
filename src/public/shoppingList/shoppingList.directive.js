'use strict'

angular.module('shoppingListMod',['shoppingListService']);

angular.module('shoppingListMod')
    .directive('shoppingList',function() {
	return {
		restrict: 'E',
		templateUrl: '/public/shoppingList/shoppingList.template.html',
		controller: function ($scope,Ingredients) {
			$scope.ingredients = Ingredients.query();

			$scope.check = function(ingredient) { 
				ingredient.checked = !ingredient.checked;
				Ingredients.update(ingredient);				
			}

			$scope.deleteAll = function() {
				Ingredients.delete().$promise.then(function() {
					$scope.ingredients = Ingredients.query();
				});
			}
		}
	}
});