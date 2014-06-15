/* Services */

app.factory('transitInfo', function ($http) {
	return {
		getRoutes: function () {
			return $http.get('http://developer.trimet.org/ws/V1/routeConfig?json=true&appID=160D6AAA210C9D54156D56820&routes=')
				.then(function(data) {
					return data.data.resultSet.route;
				});
		},
		getStops: function (routeID) {
			return $http.get('http://developer.trimet.org/ws/V1/routeConfig?json=true&appID=160D6AAA210C9D54156D56820&dir=true&stops=true&routes='+routeID)
				.then(function (data) {
					return data.data.resultSet.route[0];
				});
		},
		getArrivals: function (stopID) {
			return $http.get('http://developer.trimet.org/ws/V1/arrivals?json=true&appID=160D6AAA210C9D54156D56820&locIDs='+stopID)
				.then(function (data) {
					return {
							'arrivals': data.data.resultSet.arrival,
							'location': data.data.resultSet.location[0]
						};
				});
		}
	};
});