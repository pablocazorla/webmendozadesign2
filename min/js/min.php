<?php if(extension_loaded("zlib")){ob_start("ob_gzhandler");} header("Content-type: text/javascript"); ?>// Observable
var Observable = function(val) {
	var currentValue = val,
		subscriptions = [],
		length = 0,
		lockedSubscr = true,
		locked = false,
		obs = function(val) {
			if (typeof val === 'undefined') {
				return currentValue;
			} else {
				if (currentValue !== val && !locked) {
					currentValue = val;
					if (!lockedSubscr) {
						for (var i = 0; i < length; i++) {
							subscriptions[i](currentValue);
						}
					}
				}
				return this;
			}
		};
	obs.subscribe = function(handler) {
		if (typeof handler === 'function') {
			subscriptions.push(handler);
			length++;
		}
		return this;
	};
	obs.lock = function(flag) {
		locked = flag || true;
		return this;
	};
	obs.lockSubscriptions = function(flag) {
		lockedSubscr = flag || true;
		return this;
	};
	return obs;
};// Canvas
var Canvas = (function() {
	'use strict';
	var $window,
		canvas,
		c,
		width,
		height;

	// UTILS
	var support = (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})(),
		px = function(percent) {
			return Math.round(width * percent / 100);
		},
		setStyle = function(o) {
			for (var a in o) {
				if (typeof c[a] != 'undefined') {
					c[a] = o[a];
				}
			}
		},
		resetStyle = function(prop) {
			var p = prop || 'all',
				o = {
					'fillStyle': '#000000',
					'font': '10px sans-serif',
					'globalAlpha': 1,
					'globalCompositeOperation': 'source-over',
					'lineCap': 'butt',
					'lineDashOffset': 0,
					'lineJoin': 'miter',
					'lineWidth': 1,
					'miterLimit': 10,
					'shadowBlur': 0,
					'shadowColor': 'rgba(0, 0, 0, 0)',
					'shadowOffsetX': 0,
					'shadowOffsetY': 0,
					'strokeStyle': '#000000',
					'textAlign': 'start',
					'textBaseline': 'alphabetic'
				};
			if (typeof o[p] !== 'undefined') {
				if (typeof c[p] !== 'undefined') {
					c[p] = o[p];
				}
			} else {
				for (var a in o) {
					if (typeof c[a] !== 'undefined') {
						c[a] = o[a];
					}
				}
			}
		};

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	// Sprite
	var idCounter = 0,
		spr = function(shapeFunction) {
			return this.init(shapeFunction);
		};
	spr.prototype = {
		init: function(shapeFunction) {
			this.id = 'spr-' + idCounter;
			idCounter++;
			this.x = 0;
			this.y = 0;
			this.xScale = 1;
			this.yScale = 1;
			this.rotation = 0;
			this.parent = null;
			this.childs = [];
			this.length = 0;
			this.draw(shapeFunction);
			return this;
		},
		draw: function(shapeFunction) {
			this.shapeFunction = shapeFunction || function() {};
			return this;
		},
		append: function(sprite) {
			if (sprite.parent != null) {
				sprite.parent.detach(sprite);
			}
			this.childs.push(sprite);
			this.length++;
			sprite.parent = this;
			return this;
		},
		appendTo: function(spriteOrCanvas) {
			spriteOrCanvas.append(this);
			return this;
		},
		detach: function(sprite) {
			for (var i = 0; i < this.length; i++) {
				if (this.childs[i].id == sprite.id) {
					sprite.parent = null;
					this.childs.splice(i, 1);
					this.length--;
				}
			}
			return this;
		},
		render: function() {
			var rotRadians = this.rotation * Math.PI / 180;
			// Set Coordinates
			c.translate(px(this.x), px(this.y));
			c.rotate(rotRadians);
			c.scale(this.xScale, this.yScale);

			// Render
			this.shapeFunction();

			// Render Childs
			for (var i = 0; i < this.length; i++) {
				this.childs[i].render();
			}

			// Restore Coordinates
			c.scale(1 / this.xScale, 1 / this.yScale);
			c.rotate(-rotRadians);
			c.translate(-this.x, -this.y);

			return this;
		}
	};

	// Canvas
	return {
		support: support,
		init: function(id) {
			$window = $(window);
			canvas = document.getElementById(id);
			c = canvas.getContext('2d');
			this.childs = [];
			this.length = 0;
			var self = this;
			var updateSize = function() {
				canvas.width = width = $window.width();
				canvas.height = height = $window.height();				
			};
			updateSize();
			$window.resize(updateSize);

			
			(function animloop() {
				requestAnimFrame(animloop);
				self.render();
			})();

			return this;
		},
		append: function(sprite) {
			if (sprite.parent != null) {
				sprite.parent.detach(sprite);
			}
			this.childs.push(sprite);
			this.length++;
			sprite.parent = this;
			return this;
		},
		detach: function(sprite) {
			for (var i = 0; i < this.length; i++) {
				if (this.childs[i].id == sprite.id) {
					sprite.parent = null;
					this.childs.splice(i, 1);
					this.length--;
				}
			}
			return this;
		},
		clear:function(){
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.clearRect(0, 0, width, height);
		},
		render: function() {
			this.clear();
			for (var i = 0; i < this.length; i++) {
				c.setTransform(1, 0, 0, 1, 0, 0);
				this.childs[i].render();
			}
		},
		Sprite: function(shapeFunction) {
			return new spr(shapeFunction);
		},
		shape: {
			circle: function(op) {
				var cfg = $.extend({
					x: 0,
					y: 0,
					radius: 1,
					style: {}
				}, op);
				return function() {
					setStyle(cfg.style);
					c.beginPath();
					c.arc(px(cfg.x), px(cfg.y), px(cfg.radius), 0, Math.PI * 2);
					c.fill();
					c.stroke();
					c.closePath();
				}
			},
			rectangle:function(){
				var cfg = $.extend({
					x: 0,
					y: 0,
					width: 1,
					height: 1,
					style: {}
				}, op);
				return function() {

				}
			}
		}
	};
})();// Actor
var Actor = (function() {
	'use strict';
	var act = function(op) {
		return this.init(op);
	};
	act.prototype = {
		init: function(op) {
			this.cfg = $.extend({
				timeline: null,
				elem: null,
				type: 'sprite'
			}, op);
			this.lineTime = [];
			this.lineValues = [];
			this.length = 0;
			var setPosition = function(frame) {
				var minTime = null,
					maxTime = null;
				for (var i = 0; i < this.length - 1; i++) {
					if (this.lineTime[i] < frame && this.lineTime[i + 1] >= frame) {
						minTime = i;
						maxTime = i+1;
					}
				}
				if(minTime === null){
					minTime = this.length - 1;
					maxTime = this.length - 1;
				}

			};
			this.cfg.timeline.subscribe(setPosition);
			return this;
		},
		setFrame: function(t, val) {
			this.lineTime.push(t);
			this.lineValues.push(val);
			this.length++;
			return this;
		}
	};

	return function(op) {
		return new act(op);
	};
})();// Timeline
(function() {
	'use strict';
	// Utils
	var compare = function(a, b) {
			var ai = (typeof a.init === 'function') ? a.init() : a.init,
				bi = (typeof b.init === 'function') ? b.init() : b.init,
				r = (ai < bi) ? -1 : 0;
			r = (ai > bi) ? 1 : r;
			return r;
		},
		delta = (function() {
			var quad = function(p, e) {
					var exp = e || 2;
					return Math.pow(p, exp)
				},
				inOut = function(delta, p, e) {
					if (p < .5) {
						return delta(2 * p, e) / 2;
					} else {
						return (2 - delta(2 * (1 - p), e)) / 2;
					}
				};

			return {
				linear: function(p) {
					return p;
				},
				ease: function(p) {
					return inOut(quad, p, 2);
				}
			};
		})();

	var timeline = function(op) {
		return this.init(op);
	};
	timeline.prototype = {
		init: function(op) {
			this.f = 0;
			this.cfg = $.extend({
				duration: 10000
			});

			this.direction = 1;
			this.list = [];
			this.length = 0;



			return this;
		},
		frame: function(num) {
			if (typeof num === 'number') {
				num = (num < 0) ? 0 : num;
				num = (num > this.cfg.duration) ? this.cfg.duration : num;
				this.f = num;
				this.update();
				return this;
			} else {
				return this.f;
			}
		},
		add: function(propFunc, arrInit, arrEnd) {
			this.list.push({
				'propFunc': propFunc,
				'init': arrInit[0],
				'end': arrEnd[0],
				'initValue': arrInit[1],
				'endValue': arrEnd[1]
			});
			this.length++;
			this.list.sort(compare);
			this.update();
			return this;
		},
		update: function() {
			var initial = (this.direction > 0) ? 0 : this.length - 1;

			for (var i = initial; i >= 0 && i < this.length; i += this.direction) {
				var ti = (typeof this.list[i].init === 'function') ? this.list[i].init() : this.list[i].init,
					te = (typeof this.list[i].end === 'function') ? this.list[i].end() : this.list[i].end,
					tiv = (typeof this.list[i].initValue === 'function') ? this.list[i].initValue() : this.list[i].initValue,
					tev = (typeof this.list[i].endValue === 'function') ? this.list[i].endValue() : this.list[i].endValue;

				if (this.f >= ti && this.f <= te) {

					var progress = (this.f - ti) / (te - ti);
					progress = (progress > 1) ? 1 : progress;

					var d = delta.ease(progress),
						n = tiv + (tev - tiv) * d;
					this.list[i].propFunc(n);
				} else {
					if (this.direction < 0 && this.f < ti) {
						this.list[i].propFunc(tiv);
					}
					if (this.direction > 0 && this.f > te) {
						this.list[i].propFunc(tev);
					}
				}
			}
			return this;
		}
	};
	window.Timeline = function(op) {
		return new timeline(op);
	};
})();// App
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
});<?php if(extension_loaded("zlib")){ob_end_flush();}?>