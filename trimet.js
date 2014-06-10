/* Trimet Services - TO BE REPLACED BY ANGULAR SERVICE */
'use strict';

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

/*function getStopID(data, direction, num, callback) { // num - number of stop in chain
	if (callback !== undefined) {
		callback (data.resultSet.route[0].dir[direction].stop[num].locid);
	}
}*/