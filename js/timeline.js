// Timeline
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
})();