'use strict'

angular.module('recipes')
.factory('Recipe', ['$resource',function($resource) {
	return $resource('/api/recipes/:id',null , {
		 'update': { method:'POST' }
	});
}])
.directive('editRecipe',['$state', '$http', function($state, $http) {

	return {
		restrict: 'E',
		scope:{},
		controller: function($scope,Recipe) {
			$scope.RecipeService = Recipe;
			
		},
		link: function($scope, element, attr) {

			$scope.recipe = $scope.RecipeService.get({id:attr.recipeid} , function() {
				
					/* $http.get($scope.recipe.photoUrl, {responseType: 'blob'}).then((res) => {
						
    					$scope.recipePhotoUrl = (window.URL || window.webkitURL).createObjectURL(res.data);
  					}); */
  					$scope.recipePhotoUrl = $scope.recipe.photoUrl;
			});

			
			$scope.updating = 'OK';

			$scope.update = function() {
				$scope.recipe.$update({id:attr.recipeid},$scope.recipe,function() {
					$scope.updating = 'OK';
				},
				function(err) {
					$scope.updating = err;	
				}
				);

				// and also upload the photo if it has been modified (ie url is now a data url)
				if( $scope.recipePhotoUrl.startsWith('data:')) {

					var fd = new FormData();
    
    				fd.append('photo', $scope.photoFile);

    				$http.post('/api/upload/recipes/' + attr.recipeid + '/photo', fd, {
  							 	transformRequest: angular.identity,
   								headers: {'Content-Type': undefined}
  
    				});

				}

			};

			$scope.addStep = function() {
				$scope.recipe.steps.push({description:''})	
			};

			$scope.removeStep = function(index) {
				if (index >= 0 && index < $scope.recipe.steps.length) {
					$scope.recipe.steps.splice(index,1);	
				}	
			}

			$scope.addIngredient = function() {
				$scope.recipe.ingredients.push({description:''})	
			};

			$scope.removeIngredient = function(index) {
				if (index >= 0 && index < $scope.recipe.steps.length) {
					$scope.recipe.ingredients.splice(index,1);	
				}	
			}
			
		},
		templateUrl: '/admin/recipes/editrecipe.template.html'
	};

}])
.directive('photoUpload', function() {
  return function( scope, elm, attrs ) {
    elm.bind('change', function( evt ) {
      scope.$apply(function() {
      	var reader = new FileReader();

      	reader.onload = function() {
          scope.$apply(function() {
        	scope.recipePhotoUrl = reader.result;    
          });
        };

         scope.photoFile = evt.target.files[0];
 
        reader.readAsDataURL(evt.target.files[0]);
        
      });
    });
  };
});