/* Controllers */

'use strict';

app.controller('RouteController', function ($scope, transitInfo) {
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
		transitInfo.getRoutes().then(function (results) {
			$scope.routes = results;
		});
	};

	var init = function () {
		$scope.getRoutes();
	};

	init();



}).controller('StopController', function ($scope, $stateParams, transitInfo) {
	$scope.theRouteID = $stateParams.routeID;
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
		transitInfo.getStops($scope.theRouteID).then(function (results) {
			$scope.stops = results;
		});
	}

	var init = function () {
		if ($scope.theRouteID !== undefined) {
			$scope.getStops();
		}
	}

	init();



}).controller('ArrivalController', function ($scope, $interval, $timeout, $stateParams, transitInfo) {
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

		transitInfo.getArrivals($scope.stopID).then(function (results) {
			$scope.arrivals = results.arrivals;
			$scope.stopInfo = results.location;
			$timeout(function () { $('#refresh a i').removeClass('fa-spin') }, 980);
		})
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
			daysUntilArrival = ( arrivalTime.getDay() - $scope.day ),
			minsUntilArrival = ( arrivalTime.getHours() * 60 + arrivalTime.getMinutes() ) - ( $scope.hour * 60 + $scope.min ), // mins since midnight - mins since midnight
			hoursUntilArrival = Math.floor( minsUntilArrival/60 ),
			timeUntilArrival = (daysUntilArrival > 0 ? daysUntilArrival + ' day' : '' + ((hoursUntilArrival > 0 ? hoursUntilArrival + 'h ' : '') + minsUntilArrival % 60 + 'm'));
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