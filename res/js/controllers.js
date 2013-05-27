angular.module('twitterSearch.form',[]).
	//search form controller
	controller('SearchCtrl', function($scope, $rootScope, $location, fetchSearchService) {

		$scope.search = '';
		$scope.searchMax = 40;
		$scope.searchMin = 3;
		$scope.count = $scope.count || 15;
		$scope.searchWarning = false;

		$scope.addSearch = function(term, count) {
			if (term != '' && typeof term != 'undefined') {
				if (term.length > $scope.searchMax) {
					$scope.searchWarning = 'The search query is too long!';
				} else if (term.length < $scope.searchMin) {
					$scope.searchWarning = 'The search query is too short!';
				} else {
					if (checkPresence(term) == false) {
						$scope.searchWarning = false;
						fetchSearchService.getData(term, count).then(function(data) {
							fetchSearchService.insertSearch(data, count);
							$scope.search = '';
						});
					} else {
						$scope.searchWarning = 'You already searched for this!';
					}
				}
			} else {
				$scope.searchWarning = 'Insert a search query!';
			}
		};

		$scope.deleteItem = function(data) {
			fetchSearchService.deleteSearch(data);
		};

		$scope.navigateTo = function(url) {
			$location.path(url);
		}

		function checkPresence(term) {
			for (var i=0, l=$rootScope.searchData.length; i<l; i++) {
				var item = $rootScope.searchData[i];
				if (item.query == term) return true;
			}
			return false;
		}

	});

angular.module('twitterSearch.list',[]).
	//searche list controller
	controller('ListCtrl', function($scope, $rootScope) {

	});

angular.module('twitterSearch.detail',[]).
	//item detail controller
	controller('DetailCtrl', function($scope, $rootScope, $location, $routeParams, fetchSearchService) {
		if (typeof $rootScope.searchData == 'undefined' || typeof $rootScope.searchData[$routeParams.index] == 'undefined') {
			$scope.notHere = true;
		} else {
			$scope.notHere = false;
			$scope.item = $rootScope.searchData[$routeParams.index];

			$scope.refreshView = function(url, count) {
				fetchSearchService.refreshData(url, count).then(function(data) {
					fetchSearchService.insertSearch(data, count);
					$scope.item = $rootScope.searchData[$routeParams.index];
				});
			};

			$scope.deleteItem = function() {
				fetchSearchService.deleteSearch($scope.item);
				$location.path('/');
			};
		}
	});