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
}).directive('detourAlert',  ['transitInfo', function (transitInfo) {
	return {
		restrict: 'E',
		template: '<span class="label alert round detour" ng-show="isDetour">Alert</span>',
		scope: { arrival: '='},
		link: function (scope, element, attrs) {
			scope.isDetour = scope.arrival.detour;
			element.on('click', function (event) {
				console.log(scope.arrival);
				transitInfo.getDetours(scope.arrival.route).then(function (results) {
					$('#detourModal .message').html(results.desc);
					$('#detourModal').show();
				});
				
			});
		}
	};
}]).directive('detourModal', ['transitInfo', function (transitInfo) {
	return {
		restrict: 'E',
		template: '<div id="detourModal" style="display: none">'
					+'<exit-button></exit-button>'
					+'<div class="message">'
  					+'<h2>Awesome. I have it.</h2>'
  					+'<p class="lead">Your couch.  It is mine.</p>'
  					+'<p>Im a cool paragraph that lives inside of an even cooler modal. Wins</p>'
  					+'</div>'
					+'</div>',
		link: function (scope, element, attrs) {

			element.on('click', function () {
				$('#detourModal').hide();
			})
		}
	}
}]).directive('exitButton', function () {
	return {
		restrict: 'E',
		template: '<span class="exit"><i class="fa fa-times"></i></span>',
		link: function (scope, element, attrs) {
			element.on('click', function () {
				element.parent().hide();
			})
		}
	}
})
.directive('nearbyMap', function () {
	return {
		restrict: 'E',
		template: '<div id="nearby-canvas" height="100%"></div>',
		link: function (scope, element, attrs) {
			scope.markers = [];
			var map = null;
			var infowindows = [];
			scope.drawMap = function () {

				function moveMap() {
					//map.panBy(0,-40);
				};
				//console.log(scope.loc);
				var myLatlng = new google.maps.LatLng(scope.loc.lat,scope.loc.lng);

				var mapOptions = {
					zoom: 16,
					center: myLatlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				map = new google.maps.Map(document.getElementById('nearby-canvas'), mapOptions);
				moveMap();

				var curposMarker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: "You",
					icon: 'img/cur_position.png'
				})
				
				scope.$watch('ll.length', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						scope.markers = [];
						scope.ll.forEach(function (loc, i) {
							var tempLoc = new google.maps.LatLng(loc.lat,loc.lng);
							//console.log(loc);
							scope.markers.push(new google.maps.Marker({
									position: tempLoc,
									map: map,
									title: loc.id.toString(),
							}));
							infowindows.push(new google.maps.InfoWindow({
								content: '<div style="min-width: 100px; min-height: 30px;">'
										 +loc.desc+'<br>'
										 +'<a href="#/arrivals//'+loc.id+'">Arrivals</a>'
										 +'</div>',
								maxWidth: 200
							}));
							google.maps.event.addListener(scope.markers[i], 'click', function() {
								infowindows[i].open(map, scope.markers[i]);
							});
						})
						console.log(scope.markers);
					}
				});
			}

		}
	}
});