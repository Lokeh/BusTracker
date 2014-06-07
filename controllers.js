/* Controllers */

'use strict';

app.controller('RouteController', function ($scope) {
	$scope.routes = [];
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

	var init = function () {
		$scope.getRoutes();
	};

	init();
}).directive('filterTabs', function () {
	return {
		type: 'A',
		templateUrl: 'partials/directives/filter-tabs.html',
		link: function (scope, element, attrs) {
			scope.tab = 'all';
			scope.setTabActive = function (name) {
				scope.tab = name;
			}

			scope.isTabActive = function (check) {
				return scope.tab === check;
			}
		}

	}
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
	$scope.stopInfo = {};

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
		$('#refresh a i').addClass('fa-spin');
		Arrival($scope.stopID, function (data) {
			$scope.safeApply(function () {
				$scope.arrivals = data.resultSet.arrival;
				$scope.stopInfo = data.resultSet.location[0];
				window.setTimeout(function () {
					$('#refresh a i').removeClass('fa-spin')}, 980);
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
}).directive('googleMap', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/directives/googlemaps.html',
		link: function (scope, element, attrs) {
			function attachInfo(map, marker, window, content) {
				window.setContent(content);
				window.open(map,marker);
			};

			function Timer() {

			}
			
			window.setTimeout(function () {
				function moveMap() {
					map.panBy(0,-40);
				};
				var myLatlng = new google.maps.LatLng(scope.stopInfo.lat,scope.stopInfo.lng);
				var mapOptions = {
					zoom: 15,
					center: myLatlng
				};
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				var marker = new google.maps.Marker({
						position: myLatlng,
						map: map,
						title: 'Stop Name'
					});
				
				var infoWindow = new google.maps.InfoWindow();
				attachInfo(map, marker, infoWindow, '<div style="padding: 5px;">'+scope.stopInfo.desc+'</div>');
				window.setTimeout(function () {
					moveMap();
				}, 300);
			}, 1000);
		}
	};
});