/* Directives */

'use strict';

app.directive('filterTabs', function () {
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
}).directive('googleMap', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/directives/googlemaps.html',
		link: function (scope, element, attrs) {
			function attachInfo(map, marker, window, content) {
				window.setContent(content);
				window.open(map,marker);
			};
			
			window.setTimeout(function () { // TODO: Create marker service and move logic there, get rid of terrible terrible setTimeout
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