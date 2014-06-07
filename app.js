/* app.js */
'use strict';

var app = angular.module('busTrackerApp', ['ui.router']);

/* Filters */
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