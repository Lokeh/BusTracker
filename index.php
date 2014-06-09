<!doctype html>
<!-- index.html -->
<html class="no-js" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
		<title>PDX InTransit</title>
		<link rel="stylesheet" href="css/foundation.css" />
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
		<link rel="stylesheet" href="style.css" />
		<!-- Libraries -->
		<script src="js/vendor/jquery.js"></script>
		<script src="js/foundation.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>
		<script src="js/angular-ui-router.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>

		<!-- App -->
		<script src="app.js"></script>
		<script src="services.js"></script>
		<script src="controllers.js"></script>
		<script src="directives.js"></script>
		<script src="views.js"></script>

		<!-- Other -->
		<script src="js/vendor/modernizr.js"></script>
	</head>
	<body ng-app="busTrackerApp">
		<nav class="top-bar" data-topbar>
			<ul class="title-area">
				<li class="name">
					<h1><a href>PDX InTransit</a></h1>
				</li>
				<li class="toggle-topbar menu-icon"><a href><span>Menu</span></a></li>
			</ul>

			<section class="top-bar-section">
				<!-- Nav Section -->
				<ul class="left">
					<li ui-sref-active="active"><a ui-sref="routes">Routes</a></li>
					<li ui-sref-active="active"><a ui-sref="stops">Stops</a></li>
					<li ui-sref-active="active"><a href>Nearby</a></li>
				</ul>
				
				<!-- Right Nav Section -->
				<ul class="right">
					<li><a href>About</a></li>
				</ul>
			</section>
		</nav>
		<section role="main">
			<div class="row" ui-view>
			</div>
		</section>
	
		<script>
		  $(document).foundation();
		</script>
	</body>
</html>