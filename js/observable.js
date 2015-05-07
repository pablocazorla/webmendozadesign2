// Observable
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
};