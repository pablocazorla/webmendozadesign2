// App
$('document').ready(function() {
	if (Canvas.support) {
		Canvas.init('app-background');



		var circ = Canvas.shape.circle({
			style:{
				'fillStyle':'red'
			}
		});
		var circ2 = Canvas.shape.circle({
			radius:2,
			x:4,
			y:-1,
			style:{
				'fillStyle':'blue'
			}
		});

		var cic = Canvas.Sprite(function(){
			circ();
			circ2();
		}).appendTo(Canvas);
		cic.x = 10;
		cic.y = 20;

		var $window = $(window);
		var tim = Timeline();

		tim.add(function(num){
			cic.x = num;
		},[function(){
			return parseInt($window.height());
		},10],[function(){
			return parseInt(2 * $window.height());
		},85]);

		var $scro = $('#scro');
		$window.scroll(function(){
			var a = parseInt($('html,body').scrollTop());
			$scro.text(a);
			tim.frame(a);
		}).resize(function(){
			tim.update();
		});

/*
		var timeline = Observable(0);


		var rec = Canvas.Sprite('Rectangle', {
			fillStyle: 'red'
		}).appendTo(Canvas);

		var recActor = Actor({
			timeline:timeline
			elem:rec
		});

		*/
	}
});