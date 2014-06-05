/* app.js */
'use strict';

//(function () { // Everything in a closure... cause why not?
	/*********************** Trimet Logic ***********************/

	function Arrival(stopID, callback) {
		// AppID: 160D6AAA210C9D54156D56820
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			//url: 'http://developer.trimet.org/ws/V1/arrivals?json=true&locIDs=6849,6850&appID=160D6AAA210C9D54156D56820',
			url: 'http://developer.trimet.org/ws/V1/arrivals?json=true&appID=160D6AAA210C9D54156D56820&locIDs='+stopID,
			success: function (data) {
				if (callback !== undefined) {
					callback (data);
				}
			}
		});
	}

	function Location(long, lat, callback) {
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://developer.trimet.org/ws/V1/stops?json=true&appID=160D6AAA210C9D54156D56820&ll='+long+','+lat,
			success: function (data) {
				if (callback !== undefined) {
					callback (data);
				}
			}
		});
	}

	function Route(routeIDs, callback) {
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://developer.trimet.org/ws/V1/routeConfig?json=true&appID=160D6AAA210C9D54156D56820&routes='+routeIDs,
			success: function (data) {
				if (callback !== undefined) {
					callback (data);
				}
			}
		});
	}

	function Stops(routeID, callback) {
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://developer.trimet.org/ws/V1/routeConfig?json=true&appID=160D6AAA210C9D54156D56820&dir=true&stops=true&routes='+routeID,
			success: function (data) {
				if (callback !== undefined) {
					callback (data);
				}
			}
		})
	}

	function getStopID(data, direction, num, callback) { // num - number of stop in chain
		if (callback !== undefined) {
			callback (data.resultSet.route[0].dir[direction].stop[num].locid);
		}
	}

	function outputRoutes(data) {
		data.resultSet.route.forEach (function (route) {
			$("#routes").append('<li id="'+route.route+'">'+route.desc+'</li>');
		});
	}

	function outputStops(data) {
		var selector = "#"+data.resultSet.route[0].route;
		appendStops(selector, data.resultSet.route[0].dir);
		
	}

	function appendStops(selector, dir) {
		dir.forEach(function (direction, i) {
				//console.log(direction);
				$(selector).append('<ul id="'+i+'"><strong>'+direction.desc)+'</strong>';
				direction.stop.forEach (function (stop) {
					$(selector+" #"+i).append('<li id="'+stop.locid+'">'+stop.desc+'</li>');
				});
				$(selector).append('</ul>');
		});
	}

	function outputArrival(data) {
		selector = "#"+data.resultSet.location[0].locid
		console.log(selector);
		$(selector).append("<ul>");
		data.resultSet.arrival.forEach(function (arrival) {
			$(selector+" ul").append('<li>'+arrival.scheduled+'</li>');
		});
		$(selector).append("</ul>")
	}

	/*$(document).ready(function () {
		Route('', function (data) { outputRoutes(data) });
		Stops(58, function (data) {
			outputStops(data);
			getStopID(data, 0, 6, function (id) {
				Arrival(id, function (data) {
					outputArrival(data);
				});
			});
		});
		Stops(6, function (data) { outputStops(data); })
	});*/

	/********************* End Trimet Logic *********************/

	var app = angular.module('busTrackerApp', ['ui.router']);

	app.filter('rails', function () {
		return function (input) {
			var trains = [];
			input.forEach(function (route) {
				if (route.type === 'R') {
					trains.push(route);
				}
			});
			return trains;
		};
	});

	app.filter('bus', function () {
		return function (input) {
			var bus = [];
			input.forEach(function (route) {
				if (route.type === 'B' && route.desc.indexOf('Shuttle') === -1) {
					bus.push(route);
				}
			});
			return bus;
		};
	});

	app.filter('shuttle', function () {
		return function (input) {
			var shuttle = [];
			input.forEach(function (route){
				if (route.desc.indexOf('Shuttle') > -1) {
					shuttle.push(route);
				}
			});
			return shuttle;
		};
	});

	/* Views */
	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/routes");

		$stateProvider
			.state('routes', {
				url: "/routes",
				templateUrl: "routes-partial.html",
				controller: "RouteController as routeCtrl"
			})
			.state('stops', {
				url: "/stops/{routeID}",
				templateUrl: "stops-partial.html",
				controller: "StopController as stopCtrl"
			})
			.state('arrivals', {
				url: "/arrivals/{stopID}",
				templateUrl: "arrival-partial.html",
				controller: "ArrivalController as arrivalCtrl"
			});
	});

	app.controller('RouteController', function ($scope) {
		$scope.routes = [];
		$scope.tab = 'all';
		$scope.safeApply = function(fn) {
		    var phase = this.$root.$$phase;
		    if(phase == '$apply' || phase == '$digest') {
		        if(fn && (typeof(fn) === 'function')) {
		          fn();
		        }
		    } else {
		       this.$apply(fn);
		    }
		};

		$scope.getRoutes = function getRoutes() {
			Route('', function (data) {
				$scope.safeApply(function () {
					$scope.routes = data.resultSet.route;
				});
			});
		};

		$scope.displayRoutes = function displayRoutes() {
			console.log($scope.routes);
		};

		$scope.setTabActive = function (name) {
			$scope.tab = name;
		}

		$scope.isTabActive = function (check) {
			return $scope.tab === check;
		}

		var init = function () {
			$scope.getRoutes();
		};

		init();
	});

	app.controller('StopController', function ($scope, $stateParams) {
		$scope.routeID = $stateParams.routeID;
		$scope.stops = [];

		$scope.safeApply = function(fn) {
		    var phase = this.$root.$$phase;
		    if(phase == '$apply' || phase == '$digest') {
		        if(fn && (typeof(fn) === 'function')) {
		          fn();
		        }
		    } else {
		       this.$apply(fn);
		    }
		};


		$scope.theRoute = function () {
			return $scope.routeID;
		};

		$scope.getStops = function () {
			Stops($scope.theRoute(), function (data) {
				$scope.safeApply(function () {
					$scope.stops = data.resultSet.route[0];
				});
			});
		}

		var init = function () {
			if ($scope.routeID !== undefined) {
				$scope.getStops();
			}
		}

		init();
	});

	app.controller('ArrivalController', function ($scope, $stateParams) {
		$scope.stopID = $stateParams.stopID;
		$scope.arrivals = [];
		$scope.stopDesc = '';

		$scope.safeApply = function(fn) {
		    var phase = this.$root.$$phase;
		    if(phase == '$apply' || phase == '$digest') {
		        if(fn && (typeof(fn) === 'function')) {
		          fn();
		        }
		    } else {
		       this.$apply(fn);
		    }
		};

		$scope.theStop = function () {
			return $scope.stopID;
		};

		$scope.getArrivals = function () {
			Arrival($scope.stopID, function (data) {
				$scope.safeApply(function () {
					$scope.arrivals = data.resultSet.arrival;
					$scope.stopDesc = data.resultSet.location[0].desc;
				});
			});
		};

		$scope.theTime = function (arrival) {
			return (arrival.estimated === undefined ? arrival.scheduled : arrival.estimated);
		};

		var init = function () {
			$scope.getArrivals();
		};

		init();
	})


//}) // End Closure