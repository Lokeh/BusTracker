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



}).controller('StopController', function ($scope, $stateParams) {
	$scope.theRouteID = $stateParams.routeID;
	console.log($scope.theRouteID)
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
		return $scope.theRouteID;
	};

	$scope.getStops = function () {
		Stops($scope.theRoute(), function (data) {
			$scope.safeApply(function () {
				$scope.stops = data.resultSet.route[0];
			});
		});
	}

	var init = function () {
		if ($scope.theRouteID !== undefined) {
			$scope.getStops();
		}
	}

	init();



}).controller('ArrivalController', function ($scope, $interval, $timeout, $stateParams) {
	$scope.stopID = $stateParams.stopID;
	$scope.theRouteID = $stateParams.routeID;
	$scope.arrivals = []; // array to hold each arrival
	$scope.stopInfo = {}; // Object to hold stop info
	$scope.timeInterval; // variable to hold $interval object so we can cancel on destroy
	$scope.day, $scope.hour, $scope.min;

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

	$scope.getArrivals = function () { // TODO: Refresh logic to directive - may change after Trimet service refactor
		$('#refresh a i').addClass('fa-spin');
		console.log('world');
		Arrival($scope.stopID, function (data) {
			$scope.safeApply(function () {
				$scope.arrivals = data.resultSet.arrival;
				$scope.stopInfo = data.resultSet.location[0];
				$timeout(function () { $('#refresh a i').removeClass('fa-spin') }, 980);
			});
		});
	};

	$scope.theTime = function (arrival) {
		return (arrival.estimated === undefined ? arrival.scheduled : arrival.estimated);
	};

	$scope.getCurrentTime = function () {
		var now = new Date();
		$scope.day = now.getDay();
		$scope.hour = now.getHours();
		$scope.min = now.getMinutes();
	};

	$scope.timeUntil = function (arrival) {
		$scope.getCurrentTime();
		var arrivalTime = new Date($scope.theTime(arrival)),
			minsUntilArrival = ( arrivalTime.getHours() * 60 + arrivalTime.getMinutes() ) - ( $scope.hour * 60 + $scope.min ), // mins since midnight - mins since midnight
			hoursUntilArrival = Math.floor( minsUntilArrival/60 ),
			timeUntilArrival = (arrivalTime.getDay() > 0 ? arrivalTime.getDay() + ' day' : '' + ((hoursUntilArrival > 0 ? hoursUntilArrival + 'h ' : '') + minsUntilArrival % 60 + 'm')); 
		console.log('ugh');
		return timeUntilArrival;
	};

	var init = function () {
		$scope.getArrivals();
		$scope.timeInterval = $interval($scope.getArrivals, 60000);
	};

	$scope.$on('$destroy', function () {
		$interval.cancel($scope.timeInterval);
	});

	init();
}); 



/*
	$scope.getCurrentTime(); // $scope.hour, $scope.min
	var arrivalTime = new Date($scope.theTime(arrival))

	var arrivalMinutesSinceMidnight = arrivalTime.getHours() * 60 + arrivalTime.getMinutes();
	var currentMinutesSinceMidnight = $scope.hour * 60 + $scope.min;
	var minsUntilArrival = arrivalMinutesSinceMidnight - currentMinutesSinceMidnight;
	var timeUntilArrival = Math.floor( minsUntilArrival/60 ) + 'h' + minsUntilArrival % 60; */