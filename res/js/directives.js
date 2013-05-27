app.
	//media item for tweet search
	directive('tweetList', function(fetchSearchService) {

		return {
			templateUrl: 'res/templates/tweetList.html',
			replace: false,
			restrict: 'A',
			scope: {
				item: '=tweetList',
				index: '=urlIndex'
			},
			link: function postLink(scope, elem, attrs) {
				scope.item = attrs.item;
				scope.index = attrs.index;
				scope.deleteItem = function() {
					fetchSearchService.deleteSearch(scope.item);
				}
			}
		}

	}).
	//media item for tweets
	directive('tweetItem', function() {

		return {
			templateUrl: 'res/templates/tweetItem.html',
			replace: false,
			restrict: 'A',
			scope: {
				item: '=tweetItem'
			},
			link: function postLink(scope, elem, attrs) {
				scope.item = attrs.item;
			}
		}

	});