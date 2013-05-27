app.
	//fetch twitter search data
	factory('fetchSearchService', function($http, $q, $rootScope) {

		return {
			getData: function(search, count) {
				var url = 'http://search.twitter.com/search.json?q='+search+'&count='+count+'&rpp='+count+'&callback=JSON_CALLBACK';

				return this.refreshData(url, count);
			},
			refreshData: function(url, count) {
				var deferredModules = $q.defer();

				$http.jsonp(url).
					success(function(data, status) {
						var result = {};
						result.tweets = [];

						result.query = data.query;
						result.count = data.results_per_page;
						result.max_id = data.max_id_str;
						result.next_page = (typeof data.next_page != 'undefined') ? 'http://search.twitter.com/search.json'+data.next_page+'&count='+count+'&rpp='+count+'&callback=JSON_CALLBACK' : '';
						result.previous_page = (typeof data.previous_page != 'undefined') ? 'http://search.twitter.com/search.json'+data.previous_page+'&count='+count+'&rpp='+count+'&callback=JSON_CALLBACK' : '';
						result.page = data.page;
						result.refresh = 'http://search.twitter.com/search.json?q='+data.query+'&count='+count+'&rpp='+count+'&callback=JSON_CALLBACK';

						for (var i=0, l=data.results.length; i<l; i++) {
							var item = data.results[i],
								tweet = {};

							tweet.date = item.created_at;
							tweet.text = item.text;
							tweet.img = item.profile_image_url;
							tweet.username = item.from_user;
							tweet.name = item.from_user_name;
							result.tweets.push(tweet);
						}

						deferredModules.resolve(result);
					}).
					error(function(data, status) {
						deferredModules.reject(data || 'failed');
					});
				return deferredModules.promise;
			},
			insertSearch: function(data, count) {
				$rootScope.searchData = $rootScope.searchData || [];
				var index = this.findIndex(data),
					tempArray;

				if (index < 0) {
					$rootScope.searchData.push(data);
				} else {
					tempArray = $rootScope.searchData[index].tweets;
					$rootScope.searchData[index] = data;
					$rootScope.searchData[index].tweets = $rootScope.searchData[index].tweets.concat(tempArray).splice(0, count);
				}
			},
			deleteSearch: function(data) {
				var index = this.findIndex(data);
				$rootScope.searchData.splice(index, 1);
			},
			findIndex: function(data) {
				var index = -1,
					item;

				for (i=0, l=$rootScope.searchData.length; i<l; i++) {
					item = $rootScope.searchData[i];
					if (item.query == data.query) {
						index = i;
						break;
					}
				}

				return index;
			}
		}

	});