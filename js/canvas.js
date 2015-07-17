// Canvas
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
})();