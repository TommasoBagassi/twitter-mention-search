var app = angular.module('twitterSearch', ['twitterSearch.form', 'twitterSearch.list', 'twitterSearch.detail']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

		//form
		$routeProvider.when('/', {
			templateUrl: 'res/templates/search.html',
			controller: 'SearchCtrl'
		});

		//list
		$routeProvider.when('/list', {
			templateUrl: 'res/templates/list.html',
			controller: 'ListCtrl'
		});

		//detail
		$routeProvider.when('/detail/:index', {
			templateUrl: 'res/templates/detail.html',
			controller: 'DetailCtrl'
		});
		$routeProvider.when('/detail', {
			redirectTo: '/'
		});

		//default
		$routeProvider.otherwise({
			redirectTo: '/'
		});

	}]).
	run(function($rootScope) {
		$rootScope.searchData = $rootScope.searchData || [];
	}).
	//filter capitalize first letter
	filter('ucf', function() {
		return function(word)
		{
			return word.substring(0,1).toUpperCase() + word.slice(1);
		}
	}).
	//filter for pagination
	filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	}).
	//findURLs filter
	filter('findURLs', function() {
		return function(text) {
			if (typeof text == 'string') {
				return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
					return "<a target='_blank' href='" + url +"'>" + url + "</a>";
				});
			} else {
				return text;
			}
		}
	}).
	//findHashtags filter
	filter('findHashtags', function() {
		return function(text) {
			if (typeof text == 'string') {
				return text.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
					var tag = t.replace("#","%23");
					return "<a target='_blank' href='http://twitter.com/search?q=" + tag +"&src=hash'>" + t + "</a>";
				});
			} else {
				return text;
			}
		}
	}).
	//findUsernames filter
	filter('findUsernames', function() {
		return function(text) { 
			if (typeof text == 'string') {
				return text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
					var username = u.replace("@","");
					return "<a target='_blank' href='http://twitter.com/"+username+"'>" + u + "</a>";
				});
			} else {
				return text;
			}
		}
	}).
	//filter for moment date
	filter('moment', function() {
		return function(dateString, format) {
			format = format || 'DD MMMM';
	        return moment(dateString).format(format);
	    };
	});