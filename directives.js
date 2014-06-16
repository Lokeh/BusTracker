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
}).directive('detourAlert', function () {
	return {
		restrict: 'E',
		template: '<span class="label alert round" ng-show="isDetour" style="margin-left: 10px;"><a data-reveal-id="myModal">Detour Active</a></span>',
		scope: { arrival: '=' },
		link: function (scope, element, attrs) {
			scope.isDetour = scope.arrival.detour;
							//true;
		}
	};
}).directive('detourModal', ['transitInfo', function (transitInfo) {
	return {
		restrict: 'E',
		template: '<div id="myModal" class="reveal-modal" data-reveal>'
  					+'<h2>Awesome. I have it.</h2>'
  					+'<p class="lead">Your couch.  It is mine.</p>'
  					+'<p>Im a cool paragraph that lives inside of an even cooler modal. Wins</p>'
			  		+'<a class="close-reveal-modal">&#215;</a>'
					+'</div>',
		scope: { num: '=' },
		link: function (scope, element, attrs) {

			transitInfo.getDetours(78).then(function (results) {
				console.log(results);
			});
		}
	}
}]);