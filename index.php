<!doctype html>
<html ng-app="busTrackerApp">
	<head>
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Better Trimet Tracker</title>

		<!-- Angular -->
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>

		<script src="app.js"></script>
		<!-- Bootstrap -->
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
		<div class="container" ng-controller="RouteController as buses">
			<h1>Bus Routes</h1>
			<button type="button" ng-click="displayRoutes()">Debug</button>
			<section ng-controller="RouteTypeController as routetype">
				<ul class="nav nav-default nav-tabs">
					<li ng-class="{ active: routetype.isSelected('all') }"><a href ng-click="routetype.selectTab('all')">All</a></li>
					<li ng-class="{ active: routetype.isSelected('rails') }"><a href ng-click="routetype.selectTab('rails')">Trains</a></li>
					<li ng-class="{ active: routetype.isSelected('bus') }"><a href ng-click="routetype.selectTab('bus')">Buses</a></li>
					<li ng-class="{ active: routetype.isSelected('shuttle') }"><a href ng-click="routetype.selectTab('shuttle')">Shuttles</a></li>
					<input type="text" ng-model="searchText">
				</ul>
				<div class="panel panel-default" ng-show="routetype.isSelected('all')">
					<ul id="all">
						<li ng-repeat="route in routes | filter:searchText"><a href id="{{ route.route }}">{{ route.desc }}</a></li>
					</ul>
				</div>
				<div class="panel panel-default" ng-show="routetype.isSelected('rails')">
					<ul id="rails">
						<li ng-repeat="route in routes | rails | filter:searchText"><a href id="{{ route.route }}">{{ route.desc }}</a></li>
					</ul>
				</div>
				<div class="panel panel-default" ng-show="routetype.isSelected('bus')">
					<ul id="bus">
						<li ng-repeat="route in routes | bus | filter:searchText"><a href id="{{ route.route }}">{{ route.desc }}</a></li>
					</ul>
				</div>
				<div class="panel panel-default" ng-show="routetype.isSelected('shuttle')">
					<ul id="shuttle">
						<li ng-repeat="route in routes | shuttle | filter:searchText"><a href id="{{ route.route }}">{{ route.desc }}</a></li>
					</ul>
				</div>
			</div>
		</section>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		
	</body>
</html>