/* Views */

'use strict';

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/routes");

	$stateProvider
		.state('routes', {
			url: "/routes",
			templateUrl: "partials/routes/routes.html",
			controller: "RouteController as routeCtrl"
		})
		.state('stops', {
			url: "/stops/{routeID}",
			templateUrl: "partials/routes/stops.html",
			controller: "StopController as stopCtrl"
		})
		.state('arrivals', {
			url: "/arrivals/{routeID}/{stopID}",
			templateUrl: "partials/routes/arrival.html",
			controller: "ArrivalController as arrivalCtrl"
		});
});