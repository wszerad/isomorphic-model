'use strict';

class Cache {
	constructor() {
		this._cache = {};
	}

	put(key, value) {
		this._cache[key] = value;
	}

	get(key) {
		return this._cache[key];
	}

	del(key) {
		delete this._cache[key];
	}

	clear() {
		this._cache = {};
	}
}

module.exports = Cache;