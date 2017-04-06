'use strict'

angular.module('numberInputMod',[]);

angular.module('numberInputMod')
    .directive('numberInput',function() {
	return {
		restrict: 'E',
		scope: {
      		value: '=value'
    	},
		template: '<div class="number-input"> <button ng-click="decrease()"> remove </button> <input type="text" ng-model="value"> <button ng-click="increase()"> add </button>  </div>',
		link: function ($scope,element, attrs) {

			

			$scope.increase = function() { 
				$scope.value++;				
			}

			$scope.decrease = function() { 
				$scope.value--;				
			}
		}
	}
});