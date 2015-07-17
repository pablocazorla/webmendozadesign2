// Canvas
var Canvas = (function() {
	'use strict';
	var $window, $canvas, node, c, step = 0,

		support = (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})();

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();


	// SPRITE
	var idCounter = 0,
		setContextStyle = function(o) {
			for (var a in o) {
				if (typeof c[a] != 'undefined') {
					c[a] = o[a];
				}
			}
		},
		/*
		 * Shapes
		 */
		shapeOptionsDefault = {
			x: 0,
			y: 0,
			fillStyle: '#FFF',
			strokeStyle: '#000'
		},
		shapes = {
			'circle': function(options) {
				var o = $.extend(shapeOptionsDefault, {
					radius: 10
				}, options);
				setContextStyle(o);
			},
			'rectangle': function(options) {
				var o = $.extend(shapeOptionsDefault, {
					width: 100,
					height: 100
				}, options);
				setContextStyle(o);
				c.beginPath();
				c.moveTo(o.x, o.y);
				c.lineTo(o.x + o.width, o.y);
				c.lineTo(o.x + o.width, o.y + o.height);
				c.lineTo(o.x, o.y + o.height);
				c.lineTo(o.x, o.y);
				c.fill();
				c.stroke();
				c.closePath();
			}
		},
		/*
		 * Sprite Class
		 */
		spr = function(shapeFunction, options) {
			return this.init(shapeFunction, options);
		};
	/*
	 * Sprite Definition
	 */
	spr.prototype = {
		spriteType: true,
		init: function(shapeFunction, options) {
			this.id = 'spr-' + idCounter;
			idCounter++;

			return this.reset().shape(shapeFunction, options);
		},
		reset: function() {
			this.shp = null;
			this.x = 0;
			this.y = 0;
			this.xScale = 1;
			this.yScale = 1;
			this.rotation = 0;
			this.parent = null;
			this.childs = [];
			this.length = 0;

			return this;
		},
		shape: function(shapeFunction, options) {
			var shapeFunction = shapeFunction || function() {};

			if (typeof shapeFunction == 'string') {
				if (typeof shapes[shapeFunction.toLowerCase()] == 'function') {
					shapeFunction = shapes[shapeFunction.toLowerCase()];
				} else {
					console.log('Sorry, there is not a shape named "' + shapeFunction + '".');
				}
			}
			this.shp = function() {
				shapeFunction(options);
			};
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
			c.translate(this.x, this.y);
			c.rotate(rotRadians);
			c.scale(this.xScale, this.yScale);

			// Render
			this.shp();

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



	return {
		support: support,
		init: function() {
			$window = $(window);
			$canvas = $('#app-background');
			node = $canvas[0];
			c = node.getContext('2d');
			this.childs = [];
			this.length = 0;

			var self = this;
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
			if (typeof sprite.spriteType != 'undefined') {
				for (var i = 0; i < this.length; i++) {
					if (this.childs[i].id == sprite.id) {
						sprite.parent = null;
						this.childs.splice(i, 1);
						this.length--;
					}
				}
			}
			return this;
		},
		render: function() {
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.clearRect(0, 0, node.width, node.height);
			for (var i = 0; i < this.length; i++) {
				c.setTransform(1, 0, 0, 1, 0, 0);
				this.childs[i].render();
			}
		},
		Sprite: function(shapeFunction, options) {
			return new spr(shapeFunction, options);
		}
	}
})();