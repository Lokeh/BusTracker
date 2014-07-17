/* Services */

app.factory('transitInfo', function ($http) {
	var id = '160D6AAA210C9D54156D56820';
	return {
		getRoutes: function () {
			return $http.get('http://developer.trimet.org/ws/V1/routeConfig?json=true&appID='+id+'&routes=')
				.then(function(data) {
					return data.data.resultSet.route;
				});
		},
		getStops: function (routeID) {
			return $http.get('http://developer.trimet.org/ws/V1/routeConfig?json=true&appID='+id+'&dir=true&stops=true&routes='+routeID)
				.then(function (data) {
					return data.data.resultSet.route[0];
				});
		},
		getArrivals: function (stopID) {
			return $http.get('http://developer.trimet.org/ws/V1/arrivals?json=true&appID='+id+'&locIDs='+stopID)
				.then(function (data) {
					return {
							'arrivals': data.data.resultSet.arrival,
							'location': data.data.resultSet.location[0]
						};
				});
		},
		getDetours: function (routeID) {
			return $http.get('http://developer.trimet.org/ws/V1/detours?json=true&appID='+id+'&routes='+routeID)
				.then(function (data) {
					return {
						'raw': data.data.resultSet.detour,
						'desc': data.data.resultSet.detour[0].desc
					};
				});
		},
		getNearby: function (lat, lng, range) {
			return $http.get('http://developer.trimet.org/ws/V1/stops?json=true&appID='+id+'&meters='+range+'&ll='+lat+','+lng)
				.then(function (data) {
					return {
						'raw':data.data.resultSet,
						'stops': data.data.resultSet.location
					};
				});
		}
	};
});