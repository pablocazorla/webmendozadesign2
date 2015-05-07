<!doctype HTML>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Web Design Mendoza</title>
	<meta name="description" content="">
	<meta name="keywords" content="">
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	
	<link href='http://fonts.googleapis.com/css?family=Roboto+Slab|Open+Sans:400,300' rel='stylesheet' type='text/css'>

	<!-- CSS -->
	<link type="text/css" rel="stylesheet" href="min/packer.php?type=css&path=css&files=reset,style"/>

	<!--[if lt IE 9]>
	<script src="js/libs/html5-3.4-respond-1.1.0.min.js"></script>
	<![endif]-->
</head>
<body>
	<header class="header-main">
		<div class="brand"></div>
		<div id="menu-btn">Menú</div>
	</header>
	<div id="menu-list">
		<menu>
			<ul>
				<li><a href="#quehacemos">Qué hacemos</a></li>
				<li><a href="#ejemplos">Ejemplos</a></li>
				<li><a href="#nosotros">Quiénes somos</a></li>
				<li><a href="#proyecto">Cotiza ya gratis!</a></li>
			</ul>
		</menu>
	</div>	
	
	<div id="app">
		<h1>Content</h1>
	</div>
	<canvas id="app-background" width="2000" height="1400"></canvas>

	<script src="js/libs/jquery-1.11.2.min.js"></script>
	<script type="text/javascript" src="min/packer.php?type=js&path=js&files=observable,canvas,actor,app"></script>
</body>
</html>