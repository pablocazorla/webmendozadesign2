// Actor
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
})();